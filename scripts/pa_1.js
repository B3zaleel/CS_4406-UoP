'use strict';
document.title = 'Programming Assignment 1 - CS 4406';
// get the DOM element to attach to
const $container = $('#container');
// set the scene size
const WIDTH = Math.min($container.innerWidth(), $container.innerHeight());
const HEIGHT = Math.min($container.innerWidth(), $container.innerHeight());

// set some camera attributes
const VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 1000;

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();
let clock = new THREE.Clock();
let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
// camera = new THREE.OrthographicCamera()
// the camera starts at 0,0,0 so pull it back
camera.position.z = 200;
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

// ----------------------------------------------------------------------------------------
//  END OF THE STANDARD CODE FOR THE ASSIGNMENT
//  Following this is where you must place your own custom code to complete the assignment
// ----------------------------------------------------------------------------------------

// create a point light
let areaLight = new THREE.RectAreaLight(0xffffff, 1);

// add to the scene
scene.add(areaLight);

// create the sphere's material
let sphereMaterial = new THREE.MeshNormalMaterial();

// set up the sphere vars
let radius = 50, segments = 10, rings = 12;

// create a new mesh with sphere geometry -
// we will cover the sphereMaterial next!
let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, rings),
  sphereMaterial);
// add the sphere to the scene
scene.add(sphere);

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
