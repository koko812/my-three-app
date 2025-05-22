# 📘 LEARNED.md - Three.js + cannon-es 学習ログ

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

以上が現在までの進捗と習得内容のまとめです。
このログは、開発進行と知識の蓄積において指針となるよう継続的に更新していきます。
