import * as THREE from 'three';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let faceMesh, cameraControl;

async function start() {
  faceMesh = new FaceMesh({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`});
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  faceMesh.onResults(onResults);

  cameraControl = new Camera(video, {
    onFrame: async () => { await faceMesh.send({image: video}); },
    width: 640, height: 480
  });
  cameraControl.start();
}

function onResults(results) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    // Punto 10: frente, 33: ojo izq, 263: ojo der
    const pt1 = landmarks[33];
    const pt2 = landmarks[263];
    
    ctx.strokeStyle = '#ebfb10';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pt1.x * canvas.width, pt1.y * canvas.height);
    ctx.lineTo(pt2.x * canvas.width, pt2.y * canvas.height);
    ctx.stroke();
    
    // Indicador visual de accesorios (ej: lentes)
    ctx.fillStyle = 'rgba(235, 251, 16, 0.5)';
    ctx.fillRect(pt1.x * canvas.width - 20, pt1.y * canvas.height - 10, (pt2.x - pt1.x) * canvas.width + 40, 20);
  }
  ctx.restore();
}

document.getElementById('mode-face')?.addEventListener('click', () => {
  // Modo cara logic
});

start();
