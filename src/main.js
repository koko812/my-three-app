import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//const geometry = new THREE.BoxGeometry();
const geometry = new THREE.TorusGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let cnt = 0;
function animate() {
  requestAnimationFrame(animate);
  cnt++;
  const x = Math.cos(cnt/100) * 0.02
  const y = Math.sin(cnt/100) * 0.02
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  cube.position.x += x;
  cube.position.z += y;
  renderer.render(scene, camera);
}
animate();
