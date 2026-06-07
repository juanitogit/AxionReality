import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

let scene, camera, renderer, controls, gridHelper, transformControl;
let physicsWorld;
let objects = [];
let physicsBodies = new Map(); // Mapear obj.uuid a CANNON.Body
let selectedObject = null;
let bboxHelper = new THREE.BoxHelper();
let undoStack = [];
let redoStack = [];

export function initScene() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = null; 
  
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  
  // Luces
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);
  
  gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
  scene.add(gridHelper);
  
  // AxesHelper (Guias de modelado tipo Blender)
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
  
  scene.add(bboxHelper);
  bboxHelper.visible = false;

  // Init Física
  physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
  });
  
  // Suelo Físico (Oculto visualmente, solo existe para colisiones de físicas)
  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  physicsWorld.addBody(groundBody);
  
  // TransformControls para mover/rotar/escalar
  transformControl = new TransformControls(camera, renderer.domElement);
  const hud = document.getElementById('transform-hud');

  transformControl.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
    if(hud) hud.style.opacity = event.value ? '1' : '0';
    
    // Al terminar de arrastrar, guardar el estado para Deshacer/Rehacer
    if (!event.value) {
      saveState();
    }
  });
  
  transformControl.addEventListener('change', function () {
    if (selectedObject) {
      bboxHelper.update();
      updateUIFromObj();
      
      if (transformControl.dragging && hud) {
        const mode = transformControl.getMode();
        if (mode === 'translate') {
          hud.innerText = `Pos: X: ${selectedObject.position.x.toFixed(2)}m | Y: ${selectedObject.position.y.toFixed(2)}m | Z: ${selectedObject.position.z.toFixed(2)}m`;
        } else if (mode === 'rotate') {
          const rx = THREE.MathUtils.radToDeg(selectedObject.rotation.x).toFixed(0);
          const ry = THREE.MathUtils.radToDeg(selectedObject.rotation.y).toFixed(0);
          const rz = THREE.MathUtils.radToDeg(selectedObject.rotation.z).toFixed(0);
          hud.innerText = `Rotación: X: ${rx}° | Y: ${ry}° | Z: ${rz}°`;
        } else if (mode === 'scale') {
          hud.innerText = `Escala: X: ${selectedObject.scale.x.toFixed(2)} | Y: ${selectedObject.scale.y.toFixed(2)} | Z: ${selectedObject.scale.z.toFixed(2)}`;
        }
      }
    }
  });
  scene.add(transformControl);
  
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  
  // Selección con clic
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  container.addEventListener('pointerdown', (e) => {
    // Evitar deseleccionar si damos click sobre el gizmo
    if (e.target !== renderer.domElement) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    // Filtramos para no seleccionar el transformControl, usamos recursive=true
    const intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !objects.includes(obj)) {
        obj = obj.parent;
      }
      if (obj) selectObject(obj);
    } else {
      // Solo deseleccionar si no hicimos click en el control de transformación
      if (!transformControl.dragging) {
        selectObject(null);
      }
    }
  });

  setupUI();

  // Escena vacía por defecto
  
  animate();
}

export function selectObject(obj) {
  if (selectedObject === obj) return;
  saveState();
  selectedObject = obj;
  if (obj) {
    bboxHelper.setFromObject(obj);
    bboxHelper.visible = true;
    transformControl.attach(obj);
    updateUIFromObj();
  } else {
    bboxHelper.visible = false;
    transformControl.detach();
  }
}

export function saveState() {
  const state = objects.map(o => ({
    uuid: o.uuid,
    pos: o.position.clone(),
    rot: o.rotation.clone(),
    sca: o.scale.clone(),
    color: o.material.color.getHex(),
    visible: o.visible
  }));
  undoStack.push(state);
  if (undoStack.length > 50) undoStack.shift();
  
  // Limpiar la pila de rehacer porque se hizo una nueva acción
  redoStack = [];

  // LIVE SYNC: Si el usuario ya abrió el código QR, actualizar la vista remota
  if (window.currentLiveId) {
    uploadSceneForAR(null, window.currentLiveId);
  }
}

export function undo() {
  if (undoStack.length === 0) return;
  // Guardar estado actual en redoStack antes de deshacer
  const currentState = objects.map(o => ({
    uuid: o.uuid,
    pos: o.position.clone(),
    rot: o.rotation.clone(),
    sca: o.scale.clone(),
    color: o.material.color.getHex(),
    visible: o.visible
  }));
  redoStack.push(currentState);
  
  const state = undoStack.pop();
  applyState(state);
  showBadge("Deshacer");
}

export function redo() {
  if (redoStack.length === 0) return;
  // Guardar estado actual en undoStack
  const currentState = objects.map(o => ({
    uuid: o.uuid,
    pos: o.position.clone(),
    rot: o.rotation.clone(),
    sca: o.scale.clone(),
    color: o.material.color.getHex(),
    visible: o.visible
  }));
  undoStack.push(currentState);
  
  const state = redoStack.pop();
  applyState(state);
  showBadge("Rehacer");
}

function applyState(state) {
  // Restaurar posiciones y visibilidad
  objects.forEach(obj => {
    const savedObj = state.find(s => s.uuid === obj.uuid);
    if (savedObj) {
      // Existía en el pasado: Restaurarlo
      obj.position.copy(savedObj.pos);
      obj.rotation.copy(savedObj.rot);
      obj.scale.copy(savedObj.sca);
      obj.material.color.setHex(savedObj.color);
      
      if (obj.visible !== savedObj.visible) {
        obj.visible = savedObj.visible;
        const body = physicsBodies.get(obj.uuid);
        if (body && physicsWorld) {
          if (savedObj.visible) physicsWorld.addBody(body);
          else physicsWorld.removeBody(body);
        }
      }
    } else {
      // NO existía en el pasado (fue creado después): Lo "eliminamos" ocultándolo
      if (obj.visible) {
        obj.visible = false;
        const body = physicsBodies.get(obj.uuid);
        if (body && physicsWorld) physicsWorld.removeBody(body);
      }
    }
  });

  // Si el objeto seleccionado actualmente se volvió invisible por el undo, deseleccionarlo
  if (selectedObject && !selectedObject.visible) {
    selectObject(null);
  } else if (selectedObject) {
    bboxHelper.update();
  }
}

// ========================
// CLIPBOARD (Copiar, Cortar, Pegar, Duplicar, Eliminar)
// ========================
let clipboard = null;
let clipboardIsCut = false;

export function deleteObject() {
  if (!selectedObject) return;
  saveState();
  
  // En lugar de eliminar de memoria, lo ocultamos para que el "Deshacer" lo pueda revivir mágicamente (Soft Delete)
  selectedObject.visible = false;
  
  const body = physicsBodies.get(selectedObject.uuid);
  if (body && physicsWorld) {
    physicsWorld.removeBody(body);
  }
  
  transformControl.detach();
  bboxHelper.visible = false;
  selectedObject = null;
  showBadge("Eliminado");
}

export function duplicateObject() {
  if (!selectedObject) return;
  saveState();
  const clone = selectedObject.clone();
  clone.material = selectedObject.material.clone();
  clone.position.x += 1;
  clone.name = (selectedObject.name || 'Objeto') + ' (copia)';
  scene.add(clone);
  objects.push(clone);
  selectObject(clone);
  showBadge("Duplicado");
}

export function copyObject() {
  if (!selectedObject) return;
  clipboard = selectedObject;
  clipboardIsCut = false;
  showBadge("Copiado");
}

export function cutObject() {
  if (!selectedObject) return;
  clipboard = selectedObject;
  clipboardIsCut = true;
  showBadge("Cortado");
}

export function pasteObject() {
  if (!clipboard) return;
  saveState();
  if (clipboardIsCut) {
    // Si fue cortado, solo moverlo ligeramente
    clipboard.position.x += 1;
    selectObject(clipboard);
    clipboardIsCut = false;
    clipboard = null;
    showBadge("Pegado (mover)");
  } else {
    // Si fue copiado, clonar
    const clone = clipboard.clone();
    clone.material = clipboard.material.clone();
    clone.position.x += 1;
    clone.name = (clipboard.name || 'Objeto') + ' (copia)';
    scene.add(clone);
    objects.push(clone);
    selectObject(clone);
    showBadge("Pegado");
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  // Update Physics
  if (physicsWorld) {
    physicsWorld.step(1 / 60);
    objects.forEach(obj => {
      const body = physicsBodies.get(obj.uuid);
      if (body && body.type === CANNON.Body.DYNAMIC) {
        // Solo actualizamos el visual si no está siendo arrastrado por el transformControl
        if (selectedObject !== obj || !transformControl.dragging) {
          obj.position.copy(body.position);
          obj.quaternion.copy(body.quaternion);
        } else {
          // Si lo estamos arrastrando, sobreescribir la física
          body.position.copy(obj.position);
          body.quaternion.copy(obj.quaternion);
        }
      } else if (body && body.type !== CANNON.Body.DYNAMIC) {
        // Estático o cinemático: forzamos el cuerpo a estar donde está la malla
        body.position.copy(obj.position);
        body.quaternion.copy(obj.quaternion);
      }
    });
  }

  if (selectedObject) bboxHelper.update();
  renderer.render(scene, camera);
}

function updateUIFromObj() {
  if (!selectedObject) return;
  document.getElementById('pos-x').value = selectedObject.position.x.toFixed(2);
  document.getElementById('pos-y').value = selectedObject.position.y.toFixed(2);
  document.getElementById('pos-z').value = selectedObject.position.z.toFixed(2);
  
  document.getElementById('rot-x').value = THREE.MathUtils.radToDeg(selectedObject.rotation.x).toFixed(2);
  document.getElementById('rot-y').value = THREE.MathUtils.radToDeg(selectedObject.rotation.y).toFixed(2);
  document.getElementById('rot-z').value = THREE.MathUtils.radToDeg(selectedObject.rotation.z).toFixed(2);

  document.getElementById('sc-x').value = selectedObject.scale.x.toFixed(2);
  document.getElementById('sc-y').value = selectedObject.scale.y.toFixed(2);
  document.getElementById('sc-z').value = selectedObject.scale.z.toFixed(2);

  // Nombres y tipos
  document.getElementById('obj-name').innerText = selectedObject.name || 'Objeto 3D';
  document.getElementById('obj-type').innerText = selectedObject.type;

  // Material
  let mat = selectedObject.material;
  if (!mat && selectedObject.children && selectedObject.children.length > 0) {
    selectedObject.traverse(child => {
      if (child.isMesh && !mat) mat = child.material;
    });
  }
  
  if (mat) {
    if (mat.color) {
      const hexColor = '#' + mat.color.getHexString();
      document.getElementById('mat-color').value = hexColor;
      document.getElementById('mat-color-hex').value = hexColor;
    }
    
    if (mat.roughness !== undefined) {
      document.getElementById('mat-roughness').value = mat.roughness;
      document.getElementById('val-roughness').innerText = mat.roughness.toFixed(2);
    }
    if (mat.metalness !== undefined) {
      document.getElementById('mat-metalness').value = mat.metalness;
      document.getElementById('val-metalness').innerText = mat.metalness.toFixed(2);
    }
    
    if (mat.emissive) {
      const hexEmi = '#' + mat.emissive.getHexString();
      document.getElementById('mat-emissive').value = hexEmi;
      document.getElementById('mat-emissive-hex').value = hexEmi;
    }
    
    if (mat.opacity !== undefined) {
      document.getElementById('mat-opacity').value = mat.opacity;
      document.getElementById('val-opacity').innerText = mat.opacity.toFixed(2);
    }
    
    if (mat.wireframe !== undefined) {
      document.getElementById('mat-wireframe').checked = mat.wireframe;
    }
  }

  // Cargar info de Física y Mods en el UI
  const userData = selectedObject.userData || {};
  document.getElementById('phys-enable').checked = !!userData.physics;
  document.getElementById('phys-type').value = userData.physType || 'dynamic';
  document.getElementById('phys-mass').value = userData.mass || 1;
  document.getElementById('phys-restitution').value = userData.restitution || 0.3;
  
  document.getElementById('event-tap').value = userData.eventTap || 'none';
  document.getElementById('tracking-type').value = userData.tracking || 'surface';
  
  document.getElementById('event-url-row').style.display = userData.eventTap === 'url' ? 'flex' : 'none';
  document.getElementById('event-url-input').value = userData.eventUrl || '';
}

function updateObjFromUI() {
  if (!selectedObject) return;
  saveState();
  selectedObject.position.set(
    parseFloat(document.getElementById('pos-x').value) || 0,
    parseFloat(document.getElementById('pos-y').value) || 0,
    parseFloat(document.getElementById('pos-z').value) || 0
  );
  selectedObject.rotation.set(
    THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-x').value) || 0),
    THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-y').value) || 0),
    THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-z').value) || 0)
  );
  selectedObject.scale.set(
    parseFloat(document.getElementById('sc-x').value) || 1,
    parseFloat(document.getElementById('sc-y').value) || 1,
    parseFloat(document.getElementById('sc-z').value) || 1
  );
  
  // Sync physics
  const body = physicsBodies.get(selectedObject.uuid);
  if (body) {
    body.position.copy(selectedObject.position);
    body.quaternion.copy(selectedObject.quaternion);
  }
  
  bboxHelper.update();
}

function addShape(type) {
  let geo;
  let name = 'Objeto';
  if (type === 'cube') { geo = new THREE.BoxGeometry(1, 1, 1); name = 'Cubo'; }
  else if (type === 'sphere') { geo = new THREE.SphereGeometry(0.5, 32, 16); name = 'Esfera'; }
  else if (type === 'cylinder') { geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); name = 'Cilindro'; }
  else if (type === 'cone') { geo = new THREE.ConeGeometry(0.5, 1, 32); name = 'Cono'; }
  else if (type === 'torus') { geo = new THREE.TorusGeometry(0.5, 0.2, 16, 100); name = 'Toroide'; }
  else if (type === 'plane') { geo = new THREE.PlaneGeometry(1, 1); name = 'Plano'; }
  else if (type === 'circle') { geo = new THREE.CircleGeometry(0.5, 32); name = 'Círculo'; }
  else if (type === 'ring') { geo = new THREE.RingGeometry(0.3, 0.5, 32); name = 'Anillo'; }
  else if (type === 'capsule') { geo = new THREE.CapsuleGeometry(0.5, 1, 4, 16); name = 'Cápsula'; }
  else if (type === 'icosahedron') { geo = new THREE.IcosahedronGeometry(0.5); name = 'Icosaedro'; }
  else if (type === 'dodecahedron') { geo = new THREE.DodecahedronGeometry(0.5); name = 'Dodecaedro'; }
  
  const mat = new THREE.MeshStandardMaterial({ 
    color: Math.random() * 0xffffff,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name + ' ' + (objects.length + 1);
  mesh.position.y = 0.5;
  addObject(mesh);
}

function updateMatFromUI(prop, val) {
  if (!selectedObject) return;
  saveState();
  const applyMat = (mat) => {
    if (prop === 'color' && mat.color) mat.color.set(val);
    if (prop === 'roughness') mat.roughness = val;
    if (prop === 'metalness') mat.metalness = val;
    if (prop === 'emissive' && mat.emissive) mat.emissive.set(val);
    if (prop === 'opacity') { mat.opacity = val; mat.transparent = val < 1; }
    if (prop === 'wireframe') mat.wireframe = val;
    mat.needsUpdate = true;
  };
  
  if (selectedObject.material) {
    applyMat(selectedObject.material);
  } else {
    selectedObject.traverse(child => {
      if (child.isMesh && child.material) applyMat(child.material);
    });
  }
}

function updatePhysicsFromUI() {
  if (!selectedObject) return;
  selectedObject.userData.physics = document.getElementById('phys-enable').checked;
  selectedObject.userData.physType = document.getElementById('phys-type').value;
  selectedObject.userData.mass = parseFloat(document.getElementById('phys-mass').value);
  selectedObject.userData.restitution = parseFloat(document.getElementById('phys-restitution').value);

  // Destruir cuerpo viejo si existe
  const oldBody = physicsBodies.get(selectedObject.uuid);
  if (oldBody) {
    physicsWorld.removeBody(oldBody);
    physicsBodies.delete(selectedObject.uuid);
  }

  // Crear nuevo si está habilitado
  if (selectedObject.userData.physics) {
    const isDynamic = selectedObject.userData.physType === 'dynamic';
    const body = new CANNON.Body({
      mass: isDynamic ? selectedObject.userData.mass : 0,
      type: isDynamic ? CANNON.Body.DYNAMIC : (selectedObject.userData.physType === 'kinematic' ? CANNON.Body.KINEMATIC : CANNON.Body.STATIC),
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), // simplificado a caja por ahora
      position: new CANNON.Vec3(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z),
    });
    body.quaternion.copy(selectedObject.quaternion);
    body.material = new CANNON.Material({ restitution: selectedObject.userData.restitution });
    
    physicsWorld.addBody(body);
    physicsBodies.set(selectedObject.uuid, body);
  }
}

function setupUI() {
  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-export').addEventListener('click', exportGLB);
  
  // Upload GLB/GLTF
  document.getElementById('btn-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const model = gltf.scene;
      model.name = file.name;
      addObject(model);
    }, undefined, (error) => console.error(error));
  });

  // Agregar figuras
  document.getElementById('btn-add-cube').addEventListener('click', () => addShape('cube'));
  document.getElementById('btn-add-sphere').addEventListener('click', () => addShape('sphere'));
  document.getElementById('btn-add-cylinder').addEventListener('click', () => addShape('cylinder'));
  document.getElementById('btn-add-cone').addEventListener('click', () => addShape('cone'));
  document.getElementById('btn-add-torus').addEventListener('click', () => addShape('torus'));
  document.getElementById('btn-add-plane').addEventListener('click', () => addShape('plane'));
  document.getElementById('btn-add-circle').addEventListener('click', () => addShape('circle'));
  document.getElementById('btn-add-ring').addEventListener('click', () => addShape('ring'));
  document.getElementById('btn-add-capsule').addEventListener('click', () => addShape('capsule'));
  document.getElementById('btn-add-icosahedron').addEventListener('click', () => addShape('icosahedron'));
  document.getElementById('btn-add-dodecahedron').addEventListener('click', () => addShape('dodecahedron'));

  // Herramientas (Gizmo) y Snap
  document.getElementById('btn-tool-snap').addEventListener('change', (e) => {
    if (e.target.checked) {
      transformControl.setTranslationSnap(0.5); // Snap cada 0.5 unidades
      transformControl.setRotationSnap(THREE.MathUtils.degToRad(15)); // Snap cada 15 grados
      transformControl.setScaleSnap(0.25);
    } else {
      transformControl.setTranslationSnap(null);
      transformControl.setRotationSnap(null);
      transformControl.setScaleSnap(null);
    }
  });

  const btns = ['translate', 'rotate', 'scale'];
  btns.forEach(mode => {
    const btn = document.getElementById(`btn-tool-${mode}`);
    if(btn) {
      btn.addEventListener('click', () => {
        transformControl.setMode(mode);
        btns.forEach(b => {
          const el = document.getElementById(`btn-tool-${b}`);
          if(el) el.classList.remove('active');
        });
        btn.classList.add('active');
      });
    }
  });

  // Pegar a la base
  const btnDrop = document.getElementById('btn-drop-floor');
  if(btnDrop) {
    btnDrop.addEventListener('click', () => {
      if(!selectedObject) return;
      saveState();
      
      // Calcular el punto más bajo del objeto
      const box = new THREE.Box3().setFromObject(selectedObject);
      const lowestY = box.min.y;
      const offset = 0 - lowestY; // Lo que falta para llegar a Y=0
      
      selectedObject.position.y += offset;
      
      const body = physicsBodies.get(selectedObject.uuid);
      if(body) {
        body.position.copy(selectedObject.position);
      }
      
      bboxHelper.update();
      updateUIFromObj();
    });
  }

  // Controles por teclado (Flechas + Atajos)
  window.addEventListener('keydown', (e) => {
    // Ignorar si estamos escribiendo en un input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    // === ATAJOS GLOBALES (funcionan sin selección) ===
    if (e.ctrlKey && e.key === 'v') { e.preventDefault(); pasteObject(); return; }
    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); return; }

    if (!selectedObject) return;

    // === ATAJOS CON OBJETO SELECCIONADO ===
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteObject(); return; }
    if (e.ctrlKey && e.key === 'c') { e.preventDefault(); copyObject(); return; }
    if (e.ctrlKey && e.key === 'x') { e.preventDefault(); cutObject(); return; }
    if (e.ctrlKey && e.key === 'd') { e.preventDefault(); duplicateObject(); return; }

    const moveSpeed = e.shiftKey ? 0.5 : 0.1;
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        selectedObject.position.z -= moveSpeed;
        moved = true;
        break;
      case 'ArrowDown':
        selectedObject.position.z += moveSpeed;
        moved = true;
        break;
      case 'ArrowLeft':
        selectedObject.position.x -= moveSpeed;
        moved = true;
        break;
      case 'ArrowRight':
        selectedObject.position.x += moveSpeed;
        moved = true;
        break;
    }

    if (moved) {
      e.preventDefault();
      saveState();
      
      const body = physicsBodies.get(selectedObject.uuid);
      if (body) {
        body.position.copy(selectedObject.position);
      }
      
      bboxHelper.update();
      updateUIFromObj();
      
      const hud = document.getElementById('transform-hud');
      if (hud) {
        hud.innerText = `Pos: X: ${selectedObject.position.x.toFixed(2)}m | Z: ${selectedObject.position.z.toFixed(2)}m`;
        hud.style.opacity = '1';
        clearTimeout(window.hudTimeout);
        window.hudTimeout = setTimeout(() => { hud.style.opacity = '0'; }, 1000);
      }
    }
  });

  // Inputs manuales Transform
  const inputs = ['pos-x','pos-y','pos-z','rot-x','rot-y','rot-z','sc-x','sc-y','sc-z'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('change', updateObjFromUI);
      el.addEventListener('pointerdown', e => e.stopPropagation());
    }
  });

  // Material Bindings
  document.getElementById('mat-color').addEventListener('input', (e) => {
    document.getElementById('mat-color-hex').value = e.target.value;
    updateMatFromUI('color', e.target.value);
  });
  document.getElementById('mat-color-hex').addEventListener('change', (e) => {
    document.getElementById('mat-color').value = e.target.value;
    updateMatFromUI('color', e.target.value);
  });
  
  document.getElementById('mat-roughness').addEventListener('input', (e) => {
    document.getElementById('val-roughness').innerText = parseFloat(e.target.value).toFixed(2);
    updateMatFromUI('roughness', parseFloat(e.target.value));
  });
  
  document.getElementById('mat-metalness').addEventListener('input', (e) => {
    document.getElementById('val-metalness').innerText = parseFloat(e.target.value).toFixed(2);
    updateMatFromUI('metalness', parseFloat(e.target.value));
  });
  
  document.getElementById('mat-emissive').addEventListener('input', (e) => {
    document.getElementById('mat-emissive-hex').value = e.target.value;
    updateMatFromUI('emissive', e.target.value);
  });
  document.getElementById('mat-emissive-hex').addEventListener('change', (e) => {
    document.getElementById('mat-emissive').value = e.target.value;
    updateMatFromUI('emissive', e.target.value);
  });
  
  document.getElementById('mat-opacity').addEventListener('input', (e) => {
    document.getElementById('val-opacity').innerText = parseFloat(e.target.value).toFixed(2);
    updateMatFromUI('opacity', parseFloat(e.target.value));
  });
  
  document.getElementById('mat-wireframe').addEventListener('change', (e) => {
    updateMatFromUI('wireframe', e.target.checked);
  });

  // Física Bindings
  document.getElementById('phys-enable').addEventListener('change', updatePhysicsFromUI);
  document.getElementById('phys-type').addEventListener('change', updatePhysicsFromUI);
  document.getElementById('phys-mass').addEventListener('change', updatePhysicsFromUI);
  document.getElementById('phys-restitution').addEventListener('change', updatePhysicsFromUI);

  // Mods Bindings
  document.getElementById('event-tap').addEventListener('change', (e) => {
    if(selectedObject) selectedObject.userData.eventTap = e.target.value;
    document.getElementById('event-url-row').style.display = e.target.value === 'url' ? 'flex' : 'none';
    document.getElementById('event-sound-row').style.display = e.target.value === 'sound' ? 'flex' : 'none';
  });
  document.getElementById('event-url-input').addEventListener('input', (e) => {
    if(selectedObject) selectedObject.userData.eventUrl = e.target.value;
  });
  document.getElementById('tracking-type').addEventListener('change', (e) => {
    if(selectedObject) selectedObject.userData.tracking = e.target.value;
  });
}

export function showBadge(text) {
  const b = document.getElementById('status-badge');
  b.textContent = text;
  b.style.opacity = '1';
  setTimeout(() => b.style.opacity = '0', 2000);
}

export function getSelected() { return selectedObject; }
export function getScene() { return scene; }
export function addObject(obj) { 
  // Si hay algo seleccionado, lo deseleccionamos sin generar doble historial
  if (selectedObject) {
    transformControl.detach();
    bboxHelper.visible = false;
    selectedObject = null;
  }
  
  // Guardamos el estado ANTES de añadir el objeto para que Deshacer lo oculte
  saveState();
  
  scene.add(obj); 
  objects.push(obj); 
  
  // Seleccionarlo directamente sin llamar a selectObject (que llama a saveState de nuevo)
  selectedObject = obj;
  bboxHelper.setFromObject(obj);
  bboxHelper.visible = true;
  transformControl.attach(obj);
  updateUIFromObj();
}
export function exportGLB() {
  const exportScene = new THREE.Scene();
  const objectsToRestore = [];
  
  objects.forEach(obj => {
    if (obj.visible) {
      exportScene.add(obj);
      objectsToRestore.push(obj);
    }
  });

  const exporter = new GLTFExporter();
  exporter.parse(
    exportScene,
    function ( gltf ) {
      objectsToRestore.forEach(child => scene.add(child));
      const blob = new Blob( [ gltf ], { type: 'application/octet-stream' } );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modelo-exportado.glb';
      a.click();
    },
    function ( error ) { 
      objectsToRestore.forEach(child => scene.add(child));
      console.error(error); 
    },
    { binary: true }
  );
}

window.currentLiveId = null;

export function uploadSceneForAR(callback, explicitId = null, projectName = null) {
  const exportScene = new THREE.Scene();
  const objectsToRestore = [];
  
  objects.forEach(obj => {
    if (obj.visible) {
      exportScene.add(obj);
      objectsToRestore.push(obj);
    }
  });

  const exporter = new GLTFExporter();
  exporter.parse(
    exportScene,
    async function ( gltf ) {
      objectsToRestore.forEach(child => scene.add(child));
      const blob = new Blob([gltf], { type: 'application/octet-stream' });
      const formData = new FormData();
      formData.append('model', blob, 'scene.glb');
      
      const headers = {};
      if (explicitId) {
        headers['x-model-id'] = explicitId;
      }
      if (projectName) {
        headers['x-project-name'] = encodeURIComponent(projectName);
      }
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: headers,
          body: formData
        });
        const data = await res.json();
        if(data.success && callback) {
          callback(data.modelId); 
        }
      } catch (err) {
        console.error("Error en Live Sync:", err);
      }
    },
    function ( error ) { 
      objectsToRestore.forEach(child => scene.add(child));
      console.error("Error al exportar:", error); 
    },
    { binary: true }
  );
}

export function loadModelFromURL(url, scale = 1) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale);
    
    // Ensure all children have standard materials for visibility
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // If material is missing or broken, assign a default
        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        }
      }
    });
    
    // Add the entire model as one single selectable group
    model.name = 'Imported Model';
    addObject(model);
    
    console.log('✅ Modelo externo cargado con éxito');
  }, 
  (progress) => {
    if (progress.total) {
      const pct = Math.round((progress.loaded / progress.total) * 100);
      console.log(`📦 Descargando modelo: ${pct}%`);
    }
  },
  (error) => console.error("Error cargando modelo externo:", error));
}

window.sceneAPI = { selectObject, undo, redo, showBadge, getSelected, scene, addObject, exportGLB, uploadSceneForAR, deleteObject, duplicateObject, copyObject, cutObject, pasteObject, loadModelFromURL };

initScene();
const params = new URLSearchParams(window.location.search);
const loadId = params.get('load');
const loadName = params.get('name');
if (loadId) {
  window.currentLiveId = loadId;
  if (loadName) {
    window.currentProjectName = loadName;
  }
  const loader = new GLTFLoader();
  loader.load('/models/' + loadId, (gltf) => {
    const model = gltf.scene;
    if (model.children.length > 0) {
      const toAdd = [...model.children];
      toAdd.forEach(child => {
        if (!child.isLight && child.type !== 'TransformControls' && child.name !== 'GridHelper') {
          addObject(child);
        }
      });
    }
  }, undefined, (error) => console.error("Error cargando modelo:", error));
}
