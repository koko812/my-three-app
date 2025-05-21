// main.js
import * as THREE from 'three';

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成（視野角75度、アスペクト比、表示範囲）
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 滑らかに描画
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor(0x808080); // 明るいグレー
document.body.appendChild(renderer.domElement);

// ✅ ライト（照明）を追加：Three.jsでは物理ベースマテリアルにライトが必須
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 環境光（全体に当たる）
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // 平行光源（太陽のような）
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// 立方体の作成
// こういうところでオブジェクト化できるのが，凄腕プロラマーだということ（俺はできないのでカス）
const makeCube = (color) => {
  const geometry = new THREE.BoxGeometry();
  const threeColor = new THREE.Color(color)
  const material = new THREE.MeshStandardMaterial({
    color: threeColor,     // 青系の色
    roughness: 0.2,      // 表面のザラザラ度（0 = つるつる, 1 = マット）
    metalness: 0.8       // 金属感（0 = 非金属, 1 = 完全な金属）
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube
}

const cubeList = [];
const boxNum = 8
for (let i = 0; i < boxNum; i++) {
  const cube = makeCube(`hsl(${360 * i / boxNum}, 100%, 50%)`)
  cubeList.push(cube)
  scene.add(cube)
}

// アニメーションループ
let cnt = 0;
function animate() {
  requestAnimationFrame(animate);
  cnt++;
  for (let i = 0; i < cubeList.length; i++) {
    const cube = cubeList[i]
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    cube.position.x = Math.cos(cnt / 100 + Math.PI * 2 * i / cubeList.length) * 3.0
    cube.position.y = Math.sin(cnt / 100 + Math.PI * 2 * i / cubeList.length) * 1.0 - 0.8
    cube.position.z = Math.sin(cnt / 100 + Math.PI * 2 * i / cubeList.length) * 3.0
  }
  renderer.render(scene, camera);
}
animate();
