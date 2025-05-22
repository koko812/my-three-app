# 🧨 Three.js Rotating Cubes with OrbitControls

This is a simple Three.js project using **Vite** and **OrbitControls** to render multiple colorful rotating cubes in 3D space. You can zoom in/out and rotate the view freely with your mouse.

---
[![Image from Gyazo](https://i.gyazo.com/761edeb05d7ed905f277a425a7921d77.png)](https://gyazo.com/761edeb05d7ed905f277a425a7921d77)
---

## 🎮 Features

* Rotating cubes arranged in a circular orbit
* Animated movement along sine/cosine paths
* Colorful HSL-based cube coloring
* Realistic lighting using `MeshStandardMaterial`
* **Mouse interaction** with `OrbitControls`:

  * Drag to rotate the camera
  * Scroll to zoom in/out
  * Smooth damping effect

---

## 🚀 How to Run

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/threejs-cube-orbit.git
   cd threejs-cube-orbit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to:

   ```
   http://localhost:5173
   ```

---

## 💪 Technologies Used

* [Three.js](https://threejs.org/)
* [Vite](https://vitejs.dev/)
* JavaScript (ES Modules)
* WebGL via Three.js
* `OrbitControls` for user camera interaction

---

## 📁 File Structure

```
src/
├── main.js              # Entry point with scene setup, animation, controls
├── index.html           # Basic HTML shell
└── style.css            # (Optional) Custom styles
```

---

## 💡 Future Ideas

* Add GUI with dat.GUI or lil-gui to control parameters in real time
* Load 3D models using GLTFLoader
* Use environment maps for reflections
* Add background gradients or skyboxes
* Animate camera or set up fly-through mode

---

## 📷 Preview

*(Add a screenshot or screen recording if you like!)*

---

## 📝 License

MIT
