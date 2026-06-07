// QR Module - Live Sync con IDs únicos por sesión

document.getElementById('btn-qr').addEventListener('click', () => {
  const modal = document.getElementById('modal');
  modal.classList.add('active');
  
  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '<p style="color:var(--text); text-align:center; padding:20px;">Subiendo escena al servidor...<br><small>Generando ID único</small></p>';
  
  let link = document.getElementById('ar-test-link');
  if(link) link.style.display = 'none';

  // Reutilizar el ID si ya existe para esta sesión
  const explicitId = window.currentLiveId || null;

  window.sceneAPI.uploadSceneForAR((modelId) => {
    // Guardar el ID para Live Sync automático
    window.currentLiveId = modelId;
    
    qrContainer.innerHTML = '';
    
    // URL con el ID único del renderizado
    const url = window.location.origin + window.location.pathname.replace('index.html', '') + 'ar-viewer.html?model=' + modelId;
    
    new QRCode(qrContainer, {
      text: url,
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    
    if(!link) {
      link = document.createElement('a');
      link.id = 'ar-test-link';
      link.style.display = 'block';
      link.style.marginTop = '20px';
      link.style.color = 'var(--accent)';
      link.style.fontWeight = 'bold';
      link.style.fontSize = '18px';
      link.target = '_blank';
      document.querySelector('#modal .modal-content').insertBefore(link, qrContainer.nextSibling);
    }
    link.href = url;
    link.innerText = "👉 Abrir Visor AR en esta PC 👈";
    link.style.display = 'block';
  }, explicitId);
});
