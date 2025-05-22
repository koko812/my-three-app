import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  return renderer;
}


function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-7, 5.5, 6.5);
  return camera;
}


function createScene() {
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const spotLight = new THREE.SpotLight(0xffffff, 3);
  spotLight.position.set(2, 8, 4);
  spotLight.angle = Math.PI / 3;
  spotLight.penumbra = 0.2;
  spotLight.decay = 1;
  spotLight.distance = 100;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 50;
  spotLight.target.position.set(0, 0, 0);
  scene.add(spotLight);
  scene.add(spotLight.target);

  const helper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(helper);

  const axesHelper = new THREE.AxesHelper(10);
  axesHelper.position.set(0, 0.01, 0);
  scene.add(axesHelper);

  return scene;
}


function createPhysicsWorld() {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  return world;
}


function setupMaterials(world) {
  const sphereMat = new CANNON.Material('sphereMaterial');
  const groundMat = new CANNON.Material('groundMaterial');
  const contactMaterial = new CANNON.ContactMaterial(sphereMat, groundMat, {
    restitution: 0.7,
    friction: 0.4
  });
  world.addContactMaterial(contactMaterial);
  return { sphereMat, groundMat };
}


function createSphere(meshMaterial, physMaterial) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    meshMaterial
  );
  mesh.castShadow = true;
  mesh.position.set(1, 10, 0);

  const body = new CANNON.Body({
    mass: 3,
    shape: new CANNON.Sphere(1),
    position: new CANNON.Vec3(1, 10, 0),
    material: physMaterial
  });

  return { mesh, body };
}


function createGround(meshMaterial, physMaterial) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    meshMaterial
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;

  const body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
    material: physMaterial
  });
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

  return { mesh, body };
}


function main() {
  const renderer = createRenderer();
  const camera = createCamera();
  const scene = createScene();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const world = createPhysicsWorld();
  const { sphereMat, groundMat } = setupMaterials(world);

  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ccff,
    metalness: 0.2,
    roughness: 0.2
  });
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });

  const { mesh: sphereMesh, body: sphereBody } = createSphere(sphereMaterial, sphereMat);
  const { mesh: groundMesh, body: groundBody } = createGround(groundMaterial, groundMat);

  scene.add(sphereMesh);
  scene.add(groundMesh);
  world.addBody(sphereBody);
  world.addBody(groundBody);

  let frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

  frameCount++;
  if (frameCount % 60 === 0) {
    const pos = camera.position;
    console.log(`Camera Position: x = ${ pos.x.toFixed(2) }, y = ${ pos.y.toFixed(2) }, z = ${ pos.z.toFixed(2) } `);
    const dir = camera.getWorldDirection(new THREE.Vector3());
    console.log(`Direction: x = ${ dir.x.toFixed(2) }, y = ${ dir.y.toFixed(2) }, z = ${ dir.z.toFixed(2) } `);
  }

  controls.update();
  renderer.render(scene, camera);

    }

    animate();
  }

main();
