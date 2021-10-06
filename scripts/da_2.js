'use strict';
document.title = 'Discussion Assignmnet 2 - CS 4406';
// get the DOM element to attach to
const $container = $('#container');
// set the scene size
const WIDTH = Math.min($container.innerWidth(), $container.innerHeight());
const HEIGHT = Math.min($container.innerWidth(), $container.innerHeight());

// set some camera attributes
const VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 1000;

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer({alpha: true});
let scene = new THREE.Scene();
let clock = new THREE.Clock();
const camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, NEAR, FAR);
// the camera starts at 0,0,0 so pull it back
camera.position.z = 2;
camera.position.y = 45;
camera.position.x = 0;
// add the camera to the scene
scene.add(camera)

// set up the camera controls.  Please keep in mind that what this does is move the entire scene around.
// because the entire scene is moving the position of the camera and lights in relation to objects within
// the scene doesn't change so the lighting on the surface of the object(s) will not change either
let cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener('mousemove', renderer);
cameraControls.autoRotate = true;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// create a point light
let areaLight = new THREE.RectAreaLight(0xffffff, 1);

// add to the scene
scene.add(areaLight);

const geometry = new THREE.BufferGeometry();
let positions = [
  -2.000000, 0.000000, 0.000000,
  -1.000000, -0.000000, 1.000000,
  -1.000000, 0.000000, -1.000000,
  0.000000, -1.000000, 0.000000,
  1.000000, -0.000000, 1.000000,
  1.000000, 0.000000, -1.000000,
  1.000000, 0.000000, -1.000000,
  -1.000000, 0.000000, -1.000000,
  0.000000, -1.000000, 0.000000,
  0.000000, -1.000000, 0.000000,
  -1.000000, 0.000000, -1.000000,
  -1.000000, -0.000000, 1.000000,
  2.000000, 0.000000, 0.000000,
  1.000000, 0.000000, -1.000000,
  1.000000, -0.000000, 1.000000,
  -1.000000, -0.000000, 1.000000,
  1.000000, -0.000000, 1.000000,
  0.000000, -1.000000, 0.000000,
];
let normals = [
 0.000000, 1.000000, 0.000000,
 0.000000, 1.000000, 0.000000,
 0.000000, 1.000000, 0.000000,
 -0.707107, 0.707107, 0.000000,
 -0.707107, 0.707107, 0.000000,
 -0.707107, 0.707107, 0.000000,
 -0.000000, 0.707107, 0.707107,
 -0.000000, 0.707107, 0.707107,
 -0.000000, 0.707107, 0.707107,
 0.707107, 0.707107, 0.000000,
 0.707107, 0.707107, 0.000000,
 0.707107, 0.707107, 0.000000,
 0.000000, 1.000000, 0.000000,
 0.000000, 1.000000, 0.000000,
 0.000000, 1.000000, 0.000000,
 0.000000, 0.707107, -0.707107,
 0.000000, 0.707107, -0.707107,
 0.000000, 0.707107, -0.707107,
];
let scale = 45;
positions = positions.map(num => num * scale);

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

const material1 = new THREE.MeshBasicMaterial({color: 0xaeaeae});
const mesh = new THREE.Mesh(geometry, material1);

scene.add(mesh);

// change the scene's background color
scene.background = new THREE.Color(0x595959);

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  cameraControls.update();
  renderer.render(scene, camera);
}
animate();
