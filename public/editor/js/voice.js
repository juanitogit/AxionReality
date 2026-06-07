import { askGroq } from './groq.js';

let micOn = false;
let recognition;
const btnMic = document.getElementById('btn-toggle-mic');
const statusText = document.getElementById('voice-status');

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'es-ES';
  
  recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    document.getElementById('wave-text').textContent = `Procesando: "${transcript}"`;
    
    // Silenciar micrófono
    recognition.stop();
    micOn = false;
    btnMic.classList.remove('active');
    statusText.textContent = '';
    
    await processVoiceCommand(transcript);
  };
  
  recognition.onerror = (e) => { 
    console.error('Speech error', e); 
    resetVoiceUI();
  };
}

function resetVoiceUI() {
  document.getElementById('ai-input-container').style.display = 'block';
  document.getElementById('ai-wave-animation').style.display = 'none';
  document.getElementById('wave-text').textContent = '';
}

btnMic.addEventListener('click', () => {
  if (!recognition) return alert('Speech API no soportada en este navegador');
  micOn = !micOn;
  if (micOn) {
    recognition.start();
    btnMic.classList.add('active');
    statusText.textContent = '';
    document.getElementById('ai-input-container').style.display = 'none';
    document.getElementById('ai-wave-animation').style.display = 'flex';
    document.getElementById('wave-text').textContent = 'Escuchando...';
  } else {
    recognition.stop();
    btnMic.classList.remove('active');
    resetVoiceUI();
  }
});

async function processVoiceCommand(text) {
  const prompt = `Eres un intérprete de comandos para un editor 3D AR.
El usuario puede decir palabras sueltas, frases cortas o sinónimos. Tu trabajo es mapear lo que dice a UNA de estas acciones: MOVER, ESCALAR, ROTAR, SELECCIONAR, DESELECCIONAR, DUPLICAR, DESHACER, SNAP, CREAR_OBJETO, ELIMINAR, EXPORTAR_GLB, GENERAR_QR, CAMBIAR_COLOR, CAMBIAR_TEXTURA, MODO_AR, MODO_EDITOR, AYUDA.
Si el usuario dice algo como 'más grande', 'agrandar', 'escalar para arriba', 'hazlo enorme' → devuelve ESCALAR con parámetro scale_up.
Si dice 'muévelo', 'llévalo allá', 'desplaza' → MOVER.
Si dice 'dale vuelta', 'rota', 'gíralo' → ROTAR.
Si dice 'crea un X', 'dibuja un X', 'generar un X' → CREAR_OBJETO con parámetro 'objeto': 'X'.
Si detectas un color ('ponlo rojo', 'color azul') → CAMBIAR_COLOR con el color.
Responde SOLO con JSON: { "action": "NOMBRE_ACCION", "params": { "color": "red", "objeto": "carro" } }`;
  
  try {
    const res = await askGroq(prompt, text);
    const jsonStr = res.substring(res.indexOf('{'), res.lastIndexOf('}') + 1);
    const cmd = JSON.parse(jsonStr);
    
    window.sceneAPI.showBadge(`Voz: ${cmd.action}`);
    
    // Si no es un comando que hable, restauramos la UI al instante
    if (cmd.action !== 'CREAR_OBJETO') {
      resetVoiceUI();
    }
    
    executeCommand(cmd);
  } catch(e) {
    console.error("Groq NLU Error:", e);
    resetVoiceUI();
  }
}

function executeCommand(cmd) {
  if (cmd.action === 'DESHACER') { window.sceneAPI.undo(); return; }
  if (cmd.action === 'EXPORTAR_GLB') { window.sceneAPI.exportGLB(); return; }
  if (cmd.action === 'ELIMINAR') { window.sceneAPI.deleteObject(); return; }
  if (cmd.action === 'CREAR_OBJETO' && cmd.params && cmd.params.objeto) {
    generateObjectWithAI(cmd.params.objeto);
    return;
  }
  
  const obj = window.sceneAPI.getSelected();
  if (!obj) return;
  
  switch(cmd.action) {
    case 'ESCALAR':
      const s = obj.scale.x * 1.5;
      obj.scale.set(s,s,s);
      break;
    case 'CAMBIAR_COLOR':
      if (cmd.params.color && obj.material) {
        obj.material.color.set(cmd.params.color);
      }
      break;
  }
}

// TTS usando window.speechSynthesis para rapidez y voz nativa
async function speakWithKokoro(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    document.getElementById('ai-input-container').style.display = 'none';
    document.getElementById('ai-wave-animation').style.display = 'flex';
    document.getElementById('wave-text').textContent = 'IA Hablando...';
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    
    // Forzar voz masculina en español si está disponible
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Male') || v.name.includes('Masculino') || v.name.includes('David') || !v.name.includes('Female') && !v.name.includes('Helena') && !v.name.includes('Laura') && !v.name.includes('Sabina')));
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    utterance.onend = () => {
      resetVoiceUI();
    };
    
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      resetVoiceUI();
    };
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis no soportado en este navegador.");
    resetVoiceUI();
  }
}

document.getElementById('btn-generate-ai').addEventListener('click', () => {
  const text = document.getElementById('ai-prompt').value.trim();
  if (!text) return;
  generateObjectWithAI(text);
});

async function generateObjectWithAI(text) {
  const load = document.getElementById('ai-loading');
  const resultsDiv = document.getElementById('ai-results');
  if (load) load.style.display = 'block';
  if (resultsDiv) resultsDiv.innerHTML = '';
  
  speakWithKokoro("Buscando modelo de " + text + ". Por favor, espere.");

  try {
    // Paso 1: Traducir a inglés para mejor búsqueda
    const translatePrompt = `Traduce esta descripción de objeto 3D al inglés en UNA sola palabra o frase corta de máximo 3 palabras, optimizada para buscar un modelo 3D en una base de datos. Solo responde con la palabra/frase, sin explicaciones ni comillas.
Ejemplos: "balón de fútbol" → "soccer ball", "carro deportivo" → "sports car", "árbol de navidad" → "christmas tree", "casa" → "house"`;
    
    const searchKeyword = await askGroq(translatePrompt, text);
    const cleanKeyword = searchKeyword.trim().replace(/['"]/g, '');
    
    console.log(`Buscando: "${cleanKeyword}" (original: "${text}")`);
    
    // Paso 2: Buscar en bases de datos de modelos reales
    const searchRes = await fetch(`/api/models/search?q=${encodeURIComponent(cleanKeyword)}`);
    const searchData = await searchRes.json();
    
    const modelsWithGlb = searchData.models?.filter(m => m.glbUrl) || [];
    const modelsSketchfab = searchData.models?.filter(m => m.source === 'sketchfab') || [];
    
    if (modelsWithGlb.length > 0 || modelsSketchfab.length > 0) {
      // Mostrar galería de resultados
      if (load) load.style.display = 'none';
      
      let html = '<div style="font-size:13px; color:var(--accent); font-weight:700; margin-bottom:8px;">Modelos encontrados:</div>';
      html += '<div style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">';
      
      // Primero los que tienen GLB descargable (Poly.pizza)
      modelsWithGlb.forEach(model => {
        html += `
          <div class="ai-model-card" onclick="loadExternalModel('${model.glbUrl}', '${model.title.replace(/'/g, "\\'")}', '${model.author.replace(/'/g, "\\'")}')" 
               style="display:flex; gap:10px; padding:8px; background:var(--input-bg); border:1px solid var(--border); border-radius:8px; cursor:pointer; transition:border-color 0.2s; align-items:center;"
               onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
            ${model.thumbnail ? `<img src="${model.thumbnail}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; background:#111;">` : '<div style="width:60px;height:60px;background:#222;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#888;">Sin Img</div>'}
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:13px; font-weight:700; color:var(--fg); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${model.title}</div>
              <div style="font-size:11px; color:var(--text-muted);">por ${model.author} · <span style="color:#00c853;">GLB Directo</span></div>
            </div>
          </div>`;
      });
      
      // Luego los de Sketchfab (solo referencia visual)
      modelsSketchfab.slice(0, 4).forEach(model => {
        html += `
          <div style="display:flex; gap:10px; padding:8px; background:var(--input-bg); border:1px solid var(--border); border-radius:8px; align-items:center; opacity:0.7;">
            ${model.thumbnail ? `<img src="${model.thumbnail}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; background:#111;">` : '<div style="width:60px;height:60px;background:#222;border-radius:6px;"></div>'}
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:13px; font-weight:700; color:var(--fg); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${model.title}</div>
              <div style="font-size:11px; color:var(--text-muted);">por ${model.author} · <a href="${model.viewerUrl}" target="_blank" style="color:var(--accent);">Ver en Sketchfab ↗</a></div>
            </div>
          </div>`;
      });
      
      // Botón para generar con IA si no le gusta ninguno
      html += `
        <button onclick="generateProcedural('${text.replace(/'/g, "\\'")}')" 
                style="width:100%; padding:10px; background:transparent; border:1px dashed var(--accent); color:var(--accent); border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; margin-top:4px;">
          Generar con IA
        </button>`;
      
      html += '</div>';
      if (resultsDiv) resultsDiv.innerHTML = html;
      
      speakWithKokoro(`Se encontraron ${modelsWithGlb.length + modelsSketchfab.length} modelos. Seleccione uno para cargarlo.`);
      return;
    }
    
    // Sin resultados → fallback a generación procedural
    await generateProcedural(text);
    
  } catch(e) {
    console.error("AI Search Error:", e);
    // Fallback si falla la búsqueda
    await generateProcedural(text);
  }
  if (load) load.style.display = 'none';
}

// Cargar modelo GLB externo vía proxy del servidor
window.loadExternalModel = function(glbUrl, title, author) {
  const load = document.getElementById('ai-loading');
  const resultsDiv = document.getElementById('ai-results');
  if (load) load.style.display = 'block';
  if (resultsDiv) resultsDiv.innerHTML = '';
  
  speakWithKokoro(`Cargando modelo: ${title}, por ${author}.`);
  
  // Usar el proxy del servidor para evitar CORS
  const proxyUrl = `/api/models/proxy?url=${encodeURIComponent(glbUrl)}`;
  window.sceneAPI.loadModelFromURL(proxyUrl, 1);
  
  setTimeout(() => {
    if (load) load.style.display = 'none';
    speakWithKokoro(`Modelo ${title} cargado exitosamente en la escena.`);
  }, 3000);
};

// Generación procedural con Three.js (fallback)
window.generateProcedural = async function(text) {
  const load = document.getElementById('ai-loading');
  const resultsDiv = document.getElementById('ai-results');
  if (load) load.style.display = 'block';
  if (resultsDiv) resultsDiv.innerHTML = '';
  
  speakWithKokoro("Generando objeto con inteligencia artificial.");
  
  const prompt = `Eres un Programador Experto en Three.js. Genera un objeto 3D de: "${text}".
REGLAS ESTRICTAS:
1. SOLO devuelve el código JavaScript. NINGUNA palabra adicional, ni explicaciones, ni bloques markdown (\`\`\`).
2. Tu respuesta DEBE empezar directamente con "function createObject(THREE, scene) {".
3. NO uses texturas externas, solo materiales estándar con colores hexadecimales (MeshStandardMaterial).
4. El código debe tener esta estructura exacta:
function createObject(THREE, scene) {
  const group = new THREE.Group();
  // ... tu código ...
  return group;
}`;

  try {
    const code = await askGroq(prompt, text);
    let cleanCode = code.replace(/```javascript/gi, '').replace(/```js/gi, '').replace(/```/g, '').trim();
    
    console.log("Generando objeto con código:", cleanCode);
    const fn = new Function('THREE', 'scene', `
      ${cleanCode}
      return createObject(THREE, scene);
    `);
    
    const THREE = await import('three');
    const mesh = fn(THREE, window.sceneAPI.scene);
    if (mesh) {
      window.sceneAPI.addObject(mesh);
      speakWithKokoro("Su objeto, " + text + ", ha sido creado y añadido a la escena con éxito.");
    }
  } catch(e) {
    console.error("AI Gen Error:", e);
    speakWithKokoro("Hubo un error al generar su objeto. Intente de nuevo.");
  }
  if (load) load.style.display = 'none';
};


