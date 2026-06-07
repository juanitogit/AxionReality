const videoWrapper = document.getElementById('video-wrapper');
const video = document.getElementById('webcam');
const canvas = document.getElementById('gesture-canvas');
const ctx = canvas.getContext('2d');
let cameraOn = false;

document.getElementById('btn-toggle-cam').addEventListener('click', () => {
  cameraOn = !cameraOn;
  videoWrapper.classList.toggle('active', cameraOn);
  if (cameraOn) startCamera();
  else stopCamera();
});

let hands, cameraControl;

function startCamera() {
  if (!hands) {
    hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });
    hands.onResults(onResults);
  }

  if (!cameraControl) {
    cameraControl = new Camera(video, {
      onFrame: async () => { await hands.send({image: video}); },
      width: 640, height: 480
    });
  }
  cameraControl.start();
}

function stopCamera() {
  if (cameraControl) cameraControl.stop();
}

let lastPinchDist = 0;
let lastShakeTime = 0;

function onResults(results) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hl = results.multiHandLandmarks;
    for (let landmarks of hl) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
      drawLandmarks(ctx, landmarks, {color: '#ebfb10', lineWidth: 1, radius: 2});
    }

    const hand1 = hl[0];
    const thumb1 = hand1[4];
    const index1 = hand1[8];
    const pinchDist = Math.hypot(thumb1.x - index1.x, thumb1.y - index1.y);
    
    const obj = window.sceneAPI?.getSelected();
    
    // 1. PINCH -> MOVE
    if (pinchDist < 0.05 && obj) {
      window.sceneAPI.showBadge("AGARRAR");
      const moveX = (index1.x - 0.5) * -10; // reversed because of webcam flip
      const moveY = (0.5 - index1.y) * 10;
      obj.position.x = moveX;
      obj.position.y = Math.max(0, moveY);
    }
    
    // 2. TWO HANDS -> SCALE
    if (hl.length === 2 && obj) {
      const index2 = hl[1][8];
      const handsDist = Math.hypot(index1.x - index2.x, index1.y - index2.y);
      if (lastPinchDist > 0) {
        const delta = (handsDist - lastPinchDist) * 5;
        const s = Math.max(0.1, Math.min(5, obj.scale.x + delta));
        obj.scale.set(s,s,s);
        window.sceneAPI.showBadge("ESCALAR");
      }
      lastPinchDist = handsDist;
    } else {
      lastPinchDist = 0;
    }
    
    // 3. PALMA ABIERTA -> DESELECCIONAR
    const isOpenPalm = (hand1[8].y < hand1[5].y) && (hand1[12].y < hand1[9].y) && (hand1[16].y < hand1[13].y) && (hand1[20].y < hand1[17].y);
    if (isOpenPalm && obj) {
        window.sceneAPI.showBadge("SOLTAR");
        window.sceneAPI.selectObject(null);
    }
    
    // 5. PUÑO CERRADO -> ROTAR
    const isFist = (hand1[8].y > hand1[5].y) && (hand1[12].y > hand1[9].y) && (hand1[16].y > hand1[13].y);
    if (isFist && obj) {
        window.sceneAPI.showBadge("ROTAR");
        obj.rotation.y = (index1.x - 0.5) * Math.PI * 2;
        obj.rotation.x = (0.5 - index1.y) * Math.PI;
    }
    
    // 8. V -> DUPLICAR
    const isV = (hand1[8].y < hand1[5].y) && (hand1[12].y < hand1[9].y) && (hand1[16].y > hand1[13].y) && (hand1[20].y > hand1[17].y);
    if (isV && obj && (Date.now() - lastShakeTime > 1000)) {
        window.sceneAPI.showBadge("DUPLICAR");
        const clone = obj.clone();
        clone.position.x += 1;
        window.sceneAPI.addObject(clone);
        lastShakeTime = Date.now();
    }
  }
  ctx.restore();
}
