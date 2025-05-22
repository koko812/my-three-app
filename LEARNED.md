# 📘 LEARNED.md - Three.js + cannon-es 学習ログ 

(2025-5-22-14:53 更新)

## ✅ 導入・環境構築

* Vite + vanilla JavaScript 環境で Three.js を導入し、CDN ではなくモジュールベースで管理
* cannon-es を併用し、クライアント上で物理演算を実行

## 🌐 Three.js の学び

* `WebGLRenderer`, `PerspectiveCamera`, `Scene` の基本構成を理解
* `MeshStandardMaterial`, `MeshPhysicalMaterial` などマテリアルを変えることで質感の違いを表現
* `AmbientLight`, `SpotLight` を使ったライティングとシャドウ設定の実践
* `castShadow`, `receiveShadow`, `shadow.mapSize` などシャドウのリアリティ調整を実施
* `CameraHelper`, `SpotLightHelper`, `AxesHelper` を用いて視覚的なデバッグ補助を行った
* `OrbitControls` によりカメラの回転・ズームを操作可能に
* `camera.position`, `camera.getWorldDirection` を定期的にログ出力して視点の追跡を可視化

## 🧱 物理エンジン（cannon-es）の学び

* `World`, `Material`, `ContactMaterial`, `Body`, `Shape` などの基礎的な使い方
* `restitution`, `friction`, `mass` によるボールの跳ね方・滑り方の調整
* `linearDamping`, `angularDamping` で空気抵抗的な挙動を表現
* `step(dt, undefined, substeps)` を使い、物理計算の精度を向上
* Three.js のオブジェクトと cannon-es の Body を `.position.copy()` で同期

## 📦 モジュール化方針（単一ファイル内）

* `createRenderer`, `createCamera`, `createScene`, `createPhysicsWorld` など責務ごとに関数分離
* `createSphere`, `createGround` で Three.js + cannon-es を組み合わせたオブジェクト生成を統一
* `main()` 関数に統合して、構成要素の組み立てとループ管理を一箇所に集中


## ✨ 気づきと効果的だった設定

### ✅ スポットライトによる影のリアリティ向上

* `DirectionalLight` では影のサイズが常に一定で不自然だったが、`SpotLight` に切り替えることでカメラ距離・角度によって影が変形し、より自然になった。

```js
const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.angle = Math.PI / 3; // 広めの角度で明るく自然に
spotLight.intensity = 4;       // ← 光量を上げたことで明るさが劇的に改善
spotLight.position.set(2, 8, 4);
spotLight.castShadow = true;
```

→ カメラを回転させた際にも影の形が変わるようになり、**立体感・現実感が増した。**
→ `intensity` を上げることで暗く見えていたオブジェクトにも光が届き、視認性・演出効果ともに向上。

---

### ✅ 反発係数の調整でふわふわ感を解消

* `restitution` を初期値の `0.9` にしていたところ、ボールが「ポヨンポヨン」と現実離れした跳ね方をした。
* `0.5〜0.7` に調整したことで、**適度な反発感がありながらも落ち着いた動き**になった。

```js
const contactMaterial = new CANNON.ContactMaterial(
  sphereMaterial,
  groundMaterial,
  {
    restitution: 0.6,  // ← 現実的な弾み方に
    friction: 0.4
  }
);
```

→ 「実際の球体が落ちるような感覚」が得られ、**視覚と運動の整合性が向上。**

---

### ✅ `mass` の調整と `step` の安定化

* `mass: 1` の軽すぎるボールでは挙動が軽すぎて違和感。
* `mass: 3` に変更し、`step(1/60, undefined, 10)` によって物理演算の安定度が上がった。

```js
world.step(1 / 60, undefined, 10); // サブステップでシミュレーションの精度を向上
```

→ 重みと滑らかさが両立し、**ふわふわせず自然な物理挙動に。**

---

## 🧾 コード全体構成と詳細解説

### 1. レンダラー作成 (`createRenderer`)

* `WebGLRenderer` を使い、描画対象をブラウザ上に追加
* `shadowMap.enabled = true` によってシャドウ描画を有効化

### 2. カメラ作成 (`createCamera`)

* `PerspectiveCamera` により遠近感のある視点を構築
* 初期位置を調整して、球体と地面が見渡せるよう配置

### 3. シーン構築 (`createScene`)

* `Scene` オブジェクトを作成し、環境光・スポットライト・カメラヘルパー・軸ヘルパーを追加
* `spotLight` によって影を落とし、対象物に明暗を付加

### 4. 物理世界の生成 (`createPhysicsWorld`, `setupMaterials`)

* `World` オブジェクトに重力を与えて物理空間を構築
* `ContactMaterial` を用いてボールと床の接触挙動（反発・摩擦）を制御

### 5. オブジェクト生成 (`createSphere`, `createGround`)

* Three.js 側のジオメトリと cannon-es 側のボディを同時に生成し、組み合わせて返す
* ボールと床にはそれぞれ影の設定（cast / receive）も加える

### 6. メイン関数 (`main`)

* 上記関数を組み合わせ、カメラ・シーン・レンダラー・物理世界・オブジェクトを初期化
* `animate()` 内で：

  * `world.step()` により物理更新
  * Three.js の `mesh.position` を cannon-es の `body.position` に同期
  * カメラ位置・方向のログを 1 秒おきに出力
  * `controls.update()` により視点操作を反映し、`renderer.render()` で画面に描画

### 7. デバッグ補助

* `CameraHelper`, `AxesHelper`, `console.log` による視点・空間構造の可視化
* `SpotLightHelper` によりライトの照射範囲と影響範囲を視認可能

## 💡 パフォーマンス・構造についての考察

* Three.js + cannon-es は全てクライアント依存であり、ブラウザの JS 実行性能・GPU 性能に左右される
* React との統合は UI 層の最適化には有効だが、Three.js への再レンダリングの影響は注意が必要
* `react-three-fiber` を使えば Three.js シーンも宣言的に管理可能になるため、将来的な統合候補として検討中

## 🧪 今後の拡張案

* dat.GUI / lil-gui によるパラメータ操作の可視化
* 複数オブジェクトの管理・シーン切り替え機構
* WebSocket 等を使った外部入力による物理制御
* Three.js における Postprocessing や Bloom 等の視覚演出

---

## 📱 実験案：ジャイロセンサと WebSocket 連携

### ✅ ジャイロ取得は `DeviceOrientationEvent` で行う

Mac自体はジャイロセンサを搭載していないため、**ジャイロセンサを使いたい場合は iPhone / iPad のような実機端末が必要**。WebSocket と連携することで、センサーデバイスからの入力を PC 側に送信する構成が実現可能。

```js
// iPhone/iPad 側（センサーデータ送信）
const socket = new WebSocket('ws://your-server');
window.addEventListener('deviceorientation', (event) => {
  socket.send(JSON.stringify({
    alpha: event.alpha,
    beta: event.beta,
    gamma: event.gamma
  }));
});

// Mac 側（センサーデータ受信）
socket.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log('受信したジャイロ:', data);
};
```

* iOS Safari では `DeviceOrientationEvent.requestPermission()` が必要（ユーザー操作イベント内で）
* Mac の Chrome 等ではジャイロは基本的に取得不可（センサ未搭載）
* **iPad が研究室にあるため、今後実験的に利用予定**（WebSocket 経由で Three.js に影響を与える設計が可能）

---

以上が現在までの進捗と習得内容のまとめです。
このログは、開発進行と知識の蓄積において指針となるよう継続的に更新していきます。
