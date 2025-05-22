
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

// シーン・カメラ・レンダラー
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-7, 5.5, 6.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // ←★これを追加！
document.body.appendChild(renderer.domElement);

// Three.js: ボールの作成
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ccff,
  metalness: 0.2,
  roughness: 0.2
});

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// Three.js: 床の作成
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

sphereMesh.castShadow = true;           // ボールは影を「落とす」
groundMesh.receiveShadow = true;       // 地面は影を「受ける」

// ライト
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
/*
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(3, 10, 5);
dirLight.castShadow = true; // ←★これを追加！

// 影の解像度と範囲（任意調整）
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
*/

const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(2, 8, 4);
spotLight.angle = Math.PI / 3; // ライトの照射角（狭いほど集中）
spotLight.penumbra = 0.2;      // ソフトシャドウのぼかし
spotLight.decay = 1;           // 減衰（距離による明るさ低下）
spotLight.distance = 100;       // 照射距離

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 50;

//spotLight.shadow.focus = 1; // 焦点の調整

// optional helper for debug
const helper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(helper);

const axesHelper = new THREE.AxesHelper(10);    // 長さ10に変更
axesHelper.position.set(0, 0.01, 0);             // 地面と重ならないよう少し上に
scene.add(axesHelper);


spotLight.target.position.set(0, 0, 0); // ← 必須
scene.add(spotLight);
scene.add(spotLight.target); // 照射先を指定（デフォルトで原点）
spotLight.lookAt(spotLight.target.position); // 明示的に向かせる

//scene.add(dirLight);



// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// cannon-es: 物理ワールド作成
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// ✅ マテリアル定義と反発係数の設定
const spherePhysMat = new CANNON.Material('sphereMaterial');
const groundPhysMat = new CANNON.Material('groundMaterial');

const contactMaterial = new CANNON.ContactMaterial(
  spherePhysMat,
  groundPhysMat,
  {
    restitution: 0.7, // 跳ね返り係数（0 = 跳ねない, 1 = 完全反射）
    friction: 0.4     // 摩擦も任意で設定可
  }
);
world.addContactMaterial(contactMaterial);

// cannon-es: 床の物理ボディ
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
  material: groundPhysMat // ← 追加
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// cannon-es: ボールの物理ボディ
const sphereBody = new CANNON.Body({
  mass: 3,
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(1, 10, 0),
  material: spherePhysMat // ← 追加
});
world.addBody(sphereBody);

let frameCount = 0
// アニメーション
function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60); // 物理演算のステップ更新

  // Three.js の位置を cannon-es に同期
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  frameCount++;
  if (frameCount % 60 === 0) { // 60フレームに1回出力（約1秒おき）
    const pos = camera.position;
    console.log(`Camera Position: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`);
    const dir = camera.getWorldDirection(new THREE.Vector3());
    console.log(`Direction: x=${dir.x.toFixed(2)}, y=${dir.y.toFixed(2)}, z=${dir.z.toFixed(2)}`);
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
