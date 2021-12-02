// Debug
// const gui = new dat.GUI();
let isHovered = false;
// Canvas
const canvas = document.querySelector(".canvas1");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00241c);

//GLTF models
const gltfLoader = new THREE.GLTFLoader();
let isLoaded = false;
let gltfScene = null;
gltfLoader.load(
  // resource URL
  "media/models/DamagedHelmet.gltf",
  // called when the resource is loaded
  function (gltf) {
    gltfScene = gltf.scene;
    gltfScene.position.set(0, 0.1, 0);
    scene.add(gltf.scene);
    gltfScene.scale.set(1.1, 1.1, 1.1);
    isLoaded = true;

    gltf.animations; // Array<THREE.AnimationClip>
    gltfScene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    renderer.render(scene, camera);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);
// Objects

// Materials

// Mesh

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.y = 2;
directionalLight.position.x = 2;
directionalLight.position.z = 2;
scene.add(directionalLight);

const envMap = new THREE.CubeTextureLoader()
  .setPath("media/hdri/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
// scene.background = envMap;
scene.environment = envMap;

/**
 *
 * Sizes
 */
const sizes = {
  width: 300,
  height: 230,
};
const clock = new THREE.Clock();
clock.stop();
let lastElapsedTime = 0;

canvas.addEventListener("mouseover", () => {
  clock.start();
  isHovered = true;
  sizes.width = 360;
  sizes.height = 276;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  tick();
});
canvas.addEventListener("mouseout", () => {
  lastElapsedTime = clock.getElapsedTime() + lastElapsedTime;
  clock.stop();
  isHovered = false;
  sizes.width = 300;
  sizes.height = 230;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("resize", () => {
  // Update sizes
  //   sizes.width = window.innerWidth;
  //   sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -0.4;
camera.position.y = 0;
camera.position.z = 2.5;
scene.add(camera);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.toneMapping = THREE.ReinhardToneMapping;

/**
 * Animate
 */

const tick = () => {
  if (isHovered === true) {
    const elapsedTime = clock.getElapsedTime() + lastElapsedTime;
    // Update objects
    if (isLoaded === true) {
      gltfScene.rotation.y = 0.3 * elapsedTime;
    }
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  }
};
