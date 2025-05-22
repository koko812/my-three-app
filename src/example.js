// Three.js ライブラリ全体を THREE という名前で読み込む
import * as THREE from 'three';

// ------------------------------
// 1. シーン（3D空間）の作成
// ------------------------------
const scene = new THREE.Scene();  // 全てのオブジェクトを入れる箱のようなもの

// ------------------------------
// 2. カメラ（視点）の作成
// ------------------------------
const camera = new THREE.PerspectiveCamera(
    75,                                 // 視野角（FOV）
    window.innerWidth / window.innerHeight, // 画面のアスペクト比
    0.1,                                // 最小表示距離（カメラに近すぎると描画しない）
    1000                                // 最大表示距離（カメラから遠すぎると描画しない）
);

// カメラを Z 軸方向に5だけ遠ざけて、立方体が見えるようにする
camera.position.z = 5;

// ------------------------------
// 3. レンダラー（描画エンジン）の作成
// ------------------------------
const renderer = new THREE.WebGLRenderer();              // WebGL を使って描画するエンジン
renderer.setSize(window.innerWidth, window.innerHeight); // 描画サイズをウィンドウに合わせる
document.body.appendChild(renderer.domElement);          // 描画領域（canvas）をHTMLに追加

// ------------------------------
// 4. メッシュ（立方体）の作成
// ------------------------------
const geometry = new THREE.BoxGeometry();         // 立方体の形状（幅1, 高さ1, 奥行1）
const material = new THREE.MeshNormalMaterial();  // 表面素材：法線方向によって色が変わる
const cube = new THREE.Mesh(geometry, material);  // 形状 + 素材 → メッシュ（表示される物体）

scene.add(cube);  // メッシュをシーンに追加する

// ------------------------------
// 5. アニメーションループ
// ------------------------------
function animate() {
    requestAnimationFrame(animate); // 毎フレームこの関数を呼び出す（滑らかなアニメ）

    cube.rotation.x += 0.01;  // X軸方向に少し回転
    cube.rotation.y += 0.01;  // Y軸方向にも回転

    renderer.render(scene, camera); // シーンをカメラ視点で描画
}

// アニメーションの開始
animate();
