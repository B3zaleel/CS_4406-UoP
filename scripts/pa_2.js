'use strict';
document.title = 'Programming Assignment 2 - CS 4406';
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
// let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
// the camera starts at 0,0,0 so pull it back
camera.position.x = 0;
camera.position.y = -100;
camera.position.z = 0;
// camera.lookAt (new THREE.Vector3(0,0,0));
// add the camera to the scene
scene.add(camera)

// set up the camera controls.  Please keep in mind that what this does is move the entire scene around.
// because the entire scene is moving the position of the camera and lights in relation to objects within
// the scene doesn't change so the lighting on the surface of the object(s) will not change either
let cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener('mousemove', renderer);
// cameraControls.target = new THREE.Vector3(10, 60, 0);
cameraControls.autoRotate = true;
// disable rotation of the 3D viewport to prevent the
// disappearing effect occurring as a result of the
// model being a planar mesh
cameraControls.enableRotate = false;

// enable the viewport's grid
// var gridXZ = new THREE.GridHelper(100, 10);
// gridXZ.setColors( new THREE.Color(0xffff00), new THREE.Color(0x00ff00) );
// scene.add(gridXZ);

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// create an ambient light and add it to the scene
let light = new THREE.AmbientLight(0x11f3, 1);
scene.add(light);

// create a new buffer geometry object for creating advanced meshes
const geometry = new THREE.BufferGeometry();
// the unique vertices in the models/PA_2.ply file I created in Blender
// indices [0, 1, 2] -> [x, y, z]
const vertices = [
  [1.000000, 0.401827, -1.000000, ],
  [1.000000, 0.401828, 1.000000,],
  [-1.000000, 0.401827, -1.000000,],
  [2.748528, 0.401828, 0.510735,],
  [-2.328794, 0.401828, -0.670221,],
];
// The face indices in the models/PA_2.ply file
const faces = [
  {p0: 0, p1: 1, p2: 2},
  {p0: 0, p1: 3, p2: 1},
  {p0: 2, p1: 1, p2: 4},
];
// create an array of positions based on the faces and vertices above
let positions = [];
for (let i = 0; i < faces.length; i++) {
  // the faces of the models/DA_2.ply model are triangular
  // and 3 points form a triangle
  const facePoints = 3;
  for (let j = 0; j < facePoints; j++) {
    positions.push(vertices[faces[i][`p${j}`]][0]);
    positions.push(vertices[faces[i][`p${j}`]][1]);
    positions.push(vertices[faces[i][`p${j}`]][2]);
  }
}
let scale = 50;
// change the magnitude of each position in the
// positions array using a scale factor
positions = positions.map(num => num * scale);

// store the positions in the buffer geometry
geometry.setAttribute('position',
  new THREE.Float32BufferAttribute(positions, 3));
const material = new THREE.MeshBasicMaterial({color: 0x2213ff});
// create a mesh from the buffer geometry and its
// material and add the mesh to the scene
const mesh = new THREE.Mesh(geometry, material);
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
  // log the camera's position onto the window's console
  // let curPos = camera.position;
  // console.log(`x: ${curPos.x}, y: ${curPos.y}, z: ${curPos.z}`);
}
animate();
