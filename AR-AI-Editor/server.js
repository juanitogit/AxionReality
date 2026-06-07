const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { pool, initDB } = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_axion_key';
const PORT = 3000;

// Inicializar DB
initDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, '../public/editor')));

// --- Middleware Auth ---
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
};

// --- Rutas Auth ---
app.post('/api/auth/google', async (req, res) => {
  const { email, name, google_id } = req.body;
  
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      result = await pool.query(
        'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
        [email, name, google_id]
      );
      user = result.rows[0];
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// --- Rutas Editor ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'models');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const requestedId = req.headers['x-model-id'];
    if (requestedId && requestedId !== 'null') {
      cb(null, requestedId);
    } else {
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'render-' + uniqueId + '.glb');
    }
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', requireAuth, upload.single('model'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const fileId = req.file.filename;
  
  // Si está logueado, lo guardamos en la base de datos
  if (req.user) {
    try {
      const rawName = req.headers['x-project-name'];
      const projectName = rawName ? decodeURIComponent(rawName) : null;
      const existing = await pool.query('SELECT id FROM projects WHERE model_id = $1', [fileId]);
      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO projects (user_id, name, model_id) VALUES ($1, $2, $3)',
          [req.user.id, projectName || 'Proyecto sin título', fileId]
        );
      } else {
        if (projectName) {
          await pool.query('UPDATE projects SET updated_at = CURRENT_TIMESTAMP, name = $2 WHERE model_id = $1', [fileId, projectName]);
        } else {
          await pool.query('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE model_id = $1', [fileId]);
        }
      }
    } catch (dbErr) {
      console.error('Error guardando proyecto en BD:', dbErr);
    }
  }
  
  io.emit('model_updated', fileId);
  res.json({ success: true, modelId: fileId });
});

app.get('/api/projects', requireAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    const result = await pool.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await pool.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING model_id', [projectId, req.user.id]);
    
    if (result.rowCount > 0) {
      // Opcional: Eliminar el archivo GLB físico asociado de forma segura
      const modelId = result.rows[0].model_id;
      if (modelId) {
        const dir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'models');
        const filePath = path.join(dir, modelId);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fileErr) {
            console.error('Error eliminando archivo físico, pero DB actualizada:', fileErr);
          }
        }
      }
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Proyecto no encontrado o sin permisos' });
    }
  } catch (err) {
    console.error('Error al eliminar proyecto:', err);
    res.status(500).json({ error: err.message || 'Error interno al eliminar' });
  }
});

// --- Proxy para buscar modelos 3D reales ---
const POLY_PIZZA_KEY = process.env.POLY_PIZZA_KEY || '';

app.get('/api/models/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query requerido' });
  
  try {
    const allModels = [];
    
    // Fuente 1: Poly.pizza (modelos CC0 con GLB directo)
    if (POLY_PIZZA_KEY) {
      try {
        const ppRes = await fetch(`https://api.poly.pizza/v1.1/search/${encodeURIComponent(query)}?Limit=5`, {
          headers: { 'x-auth-token': POLY_PIZZA_KEY }
        });
        if (ppRes.ok) {
          const data = await ppRes.json();
          if (data.results && data.results.length > 0) {
            data.results.forEach(m => allModels.push({
              id: m.ID,
              title: m.Title,
              author: m.Creator?.Username || 'Unknown',
              glbUrl: m.Download,
              thumbnail: m.Thumbnail,
              source: 'poly.pizza'
            }));
          }
        }
      } catch (e) { console.error('Poly.pizza error:', e.message); }
    }
    
    // Fuente 2: Sketchfab (modelos descargables, thumbnails de alta calidad)
    try {
      const sfRes = await fetch(`https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&downloadable=true&archives_flavours=false&sort_by=-likeCount&count=8`);
      if (sfRes.ok) {
        const data = await sfRes.json();
        if (data.results && data.results.length > 0) {
          data.results.forEach(m => {
            // Sketchfab oEmbed GLB URL pattern (for embeddable models)
            const embedGlb = `https://sketchfab.com/models/${m.uid}/embed`;
            allModels.push({
              id: m.uid,
              title: m.name,
              author: m.user?.displayName || 'Unknown',
              glbUrl: null,
              viewerUrl: `https://sketchfab.com/3d-models/${m.slug}-${m.uid}`,
              thumbnail: m.thumbnails?.images?.find(i => i.width >= 200)?.url || m.thumbnails?.images?.[0]?.url || null,
              source: 'sketchfab',
              embedUrl: embedGlb
            });
          });
        }
      }
    } catch (e) { console.error('Sketchfab error:', e.message); }
    
    res.json({ models: allModels });
  } catch (err) {
    console.error('Error buscando modelos:', err);
    res.json({ models: [] });
  }
});

// --- CORS Proxy para cargar GLB desde CDN externos (Poly.pizza, etc) ---
app.get('/api/models/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url || (!url.startsWith('https://static.poly.pizza') && !url.includes('.glb'))) {
    return res.status(400).json({ error: 'URL no permitida' });
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(502).json({ error: 'Error descargando modelo' });
    
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set({
      'Content-Type': 'model/gltf-binary',
      'Content-Length': buffer.length,
      'Access-Control-Allow-Origin': '*'
    });
    res.send(buffer);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Error en proxy' });
  }
});

// --- Proxy AI ---
const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

let currentGroqKeyIndex = 0;

app.post('/api/ai', async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;
  if (!systemPrompt || !userPrompt) return res.status(400).json({ error: 'Faltan prompts' });

  for (let attempt = 0; attempt < GROQ_KEYS.length; attempt++) {
    const key = GROQ_KEYS[currentGroqKeyIndex];
    currentGroqKeyIndex = (currentGroqKeyIndex + 1) % GROQ_KEYS.length;
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      if (!response.ok) continue; // Try next key
      if (!data.choices) throw new Error("No choices in response");
      
      return res.json({ result: data.choices[0].message.content });
    } catch (e) {
      console.error('Groq Error:', e.message);
    }
  }
  res.status(500).json({ error: 'Todas las llaves fallaron' });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado al Live Sync');
});

// Serve models dynamically
app.get('/models/:id', (req, res) => {
  const dir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'models');
  const filePath = path.join(dir, req.params.id);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    const staticPath = path.join(__dirname, 'models', req.params.id);
    if (fs.existsSync(staticPath)) {
      res.sendFile(staticPath);
    } else {
      res.status(404).send('Not found');
    }
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🚀 AXION Studio Backend (Auth + BD) en línea`);
    console.log(`========================================\n`);
  });
}

module.exports = app;
