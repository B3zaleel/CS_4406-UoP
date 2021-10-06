'use strict';
document.title = 'Programming Assignment 3 - CS 4406';
// get the DOM element to attach to
const $container = $('#container');
// set the scene size
const WIDTH = Math.min($container.innerWidth(), $container.innerHeight());
const HEIGHT = Math.min($container.innerWidth(), $container.innerHeight());

// set some camera attributes
const VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 1000;

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();
let clock = new THREE.Clock();
let camera;
camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, NEAR, FAR);
// the camera starts at 0,0,0 so pull it back
camera.position.z = 200;
// add the camera to the scene
scene.add(camera)

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// create a point light and add it to an object3d, which would
// make repositioning of the light source easier
let light = new THREE.DirectionalLight(0xffffaa, 2.0);
var lightObj = new THREE.Object3D();
light.position.set(0, 0, 0); // default; light shining from top
light.castShadow = true;
// create and add a helper to make the light's position easier to see
const helper = new THREE.DirectionalLightHelper(light, 10 , 0x34ff95);
scene.add(helper);
// add to the scene
lightObj.add(light)
scene.add(lightObj);
// move the light object to the top left corner
lightObj.rotateZ(2.8);
lightObj.position.x = -(WIDTH/2) + 10;
lightObj.position.y = (WIDTH/2) - 10;
lightObj.position.z = 80;
lightObj.lookAt(new THREE.Vector3(0, 0, 0))

// create the sphere's material
let sphereMaterial;
sphereMaterial = new THREE.MeshPhongMaterial( {
  color: 0x2be4de,
  specular:0x333333,
  shininess: 100
});
// set up the sphere vars
let radius = 10, segments = 32, rings = 16;

// create a new mesh with sphere geometry
let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, rings),
  sphereMaterial);
// make the sphere shadow castable but not receivable
sphere.castShadow = true;
sphere.receiveShadow = false;
// add the sphere to the scene
scene.add(sphere);

// create a plane behind the sphere on which the sphere will cast a shadow
var planeGeometry = new THREE.PlaneBufferGeometry( WIDTH + 100, WIDTH + 100, 32, 32 );
var planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } )
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.z -= 10;
// set receiveShadow on the plane
// so that the sphere can cast a shadow on the plane
plane.receiveShadow = true;
// add the plane to the scene
scene.add(plane);

// change the scene's background color
scene.background = new THREE.Color(0x111);
let time, delta;
let dirX = 1;
let dirY = 2;
const speed = 2.5;
const lowBounds = 0 - (WIDTH / 2); // the low half of the render frame
const highBounds = WIDTH / 2; // the high half of the render frame
// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  // animate the ball in y direction
  sphere.position.y += dirY * speed;
  // animate the sphere in x direction
  sphere.position.x += dirX * speed;
  // the sphere changes direction and color when it gets to the left wall
  if (sphere.position.x <= lowBounds) {
    dirX = -dirX;
    sphere.material.color.setHex(0x8f0000);
  }
  // the sphere changes direction and color when it gets to the right wall
  if (sphere.position.x >= highBounds) {
    dirX = -dirX;
    sphere.material.color.setHex(0x00ff10);
  }
  // the sphere changes direction and color when it gets to the bottom wall
  if (sphere.position.y <= lowBounds) {
    dirY = -dirY;
    sphere.material.color.setHex(0xffff00);
  }
  // the sphere changes direction and color when it gets to the top wall
  if (sphere.position.y >= highBounds) {
    dirY = -dirY;
    sphere.material.color.setHex(0x0000ff);
  }
  renderer.render(scene, camera);
}

// start the animation
animate();
