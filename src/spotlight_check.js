import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SpotLightHelper } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ボール
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
sphere.position.set(0, 1, 0); // ← 原点より上に配置
sphere.castShadow = true;
scene.add(sphere);

//環境光
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);


// スポットライト
const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 3;       // 広がりを増やす
spotLight.penumbra = 0.4;            // 周辺ぼかし
spotLight.decay = 1;                 // 減衰を弱める
spotLight.distance = 100;            // 十分な照射距離

spotLight.castShadow = true;
spotLight.shadow.mapSize.set(2048, 2048); // 影の解像度をアップ（高画質！）


// 影の設定
spotLight.shadow.mapSize.set(1024, 1024);
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 100;

// 🔥 重要：target をボールに向ける
spotLight.target.position.copy(sphere.position);
scene.add(spotLight.target);
scene.add(spotLight);

// デバッグ用：照射方向ヘルパー
const helper = new SpotLightHelper(spotLight);
scene.add(helper);

// カメラ操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  helper.update();
  renderer.render(scene, camera);
}
animate();
