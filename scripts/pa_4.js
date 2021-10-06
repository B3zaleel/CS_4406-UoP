"use strict";
document.title = "Programming Assignment 4 - CS 4406";
// get the DOM element to attach to
const $container = $("#container");
// set the scene size
const WIDTH = Math.min($container.innerWidth(), $container.innerHeight());
const HEIGHT = Math.min($container.innerWidth(), $container.innerHeight());

// set some camera attributes
const VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 1000;

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();

// create the camera for viewing the scene
let camera = new THREE.OrthographicCamera(
  WIDTH / -2,
  WIDTH / 2,
  HEIGHT / 2,
  HEIGHT / -2,
  NEAR,
  FAR
);
// the camera starts at 0,0,0 so pull it back
camera.position.z = 150;
// add the camera to the scene
scene.add(camera);

// set up the camera controls.
let cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener('mousemove', renderer);
cameraControls.autoRotate = false;

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// #region Creating the light source
// create a point light and add it to an object3d, which would
// make repositioning of the light source easier
let light = new THREE.DirectionalLight(0xe9a617, 2.0);
var lightObj = new THREE.Object3D();
light.position.set(0, 0, 0); // default; light shining from top
light.castShadow = true;
// create and add a helper to make the light's position easier to see
// const helper = new THREE.DirectionalLightHelper(light, 10, 0x34ff95);
// scene.add(helper);
// add the light to the scene
lightObj.add(light);
scene.add(lightObj);
// move the light backward
lightObj.position.z = 80;
lightObj.lookAt(new THREE.Vector3(0, 0, 0));
// #endregion

// Creating the objects
// #region Object 1
const obj0 = new THREE.Object3D();
// create the mesh's material
const mat0 = new THREE.MeshPhongMaterial({
  color: 0x2be4de,
  specular: 0x333333,
  shininess: 100,
  reflectivity: 1,
});
// create a new mesh with sphere geometry
const params0 = {
  radius: 35,
  segments: 32,
  rings: 16,
};
const mesh0 = new THREE.Mesh(
  new THREE.SphereGeometry(params0.radius, params0.segments, params0.rings),
  mat0
);
// add mesh0 to the first object
obj0.add(mesh0);
// move the object to the top left quadrant
obj0.position.x = -(WIDTH / 4);
obj0.position.y = (WIDTH / 4);
// #endregion

// #region Object 2
const obj1 = new THREE.Object3D();
// load the mesh's texture
const texture = new THREE.TextureLoader().load('textures/TexturesCom_BrickFacade0006_1_seamless_S.jpg');
// immediately use the texture for the material creation
const mat1 = new THREE.MeshBasicMaterial({map: texture});
// create a new mesh with box geometry
const params1 = {
  width: 50,
  height: 60,
  depth: 30,
};
const mesh1 = new THREE.Mesh(
  new THREE.BoxGeometry(params1.width, params1.height, params1.depth),
  mat1
);
// make the mesh shadow castable but not receivable
mesh1.castShadow = true;
mesh1.receiveShadow = false;
// add mesh1 to the second object
obj1.add(mesh1);
// move the object to the top right quadrant
obj1.position.x = (WIDTH / 4);
obj1.position.y = (WIDTH / 4);
// uncomment the lines below to see the texture around the
// object or you can rotate the scene since the camera
// controls have been set up
// obj1.rotateZ(0.345);
// obj1.rotateX(1.0472);
// obj1.rotateY(0.7854);
// #endregion

// #region Object 3
const obj2 = new THREE.Object3D();
// create the mesh's material
// this material is partially transparent
const mat2 = new THREE.MeshBasicMaterial({
  color: 0xbb1455,
  opacity: 0.4,
  transparent: true,
});
// create the curve for the tube geometry
class CustomCurve extends THREE.Curve {
  constructor(scale = 1) {
		super();
		this.scale = scale;
	}

  getPoint(t, optionalTarget = new THREE.Vector3()) {
		const tx = t * 3 - 1.5;
		const ty = Math.sin(2 * Math.PI * t) + Math.cos(2 * Math.PI * 2 * t);
		const tz = 0;

		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
	}
}
// create a new mesh with tube geometry
const params2 = {
  path : new CustomCurve(20),
  tubularSegments : 20,
  radius : 5,
  radialSegments : 8,
  closed : false,
};
const mesh2 = new THREE.Mesh(
  new THREE.TubeGeometry(params2.path, params2.tubularSegments, params2.radius, params2.radialSegments, params2.closed),
  mat2
);
// add mesh2 to the third object
obj2.add(mesh2);
// move the object to the bottom left quadrant
obj2.position.x = -(WIDTH / 4);
obj2.position.y = -(WIDTH / 4);
// #endregion

// #region Object 4
const obj3 = new THREE.Object3D();
// create the mesh's material
const mat3 = new THREE.MeshBasicMaterial({color: 0x7b3ba0});
// create a new mesh with a torus knot geometry
const params3 = {
  radius: 30,
  tube: 3,
  tubularSegments: 100,
  radialSegments: 16,
  p: 3,
  q: 5,
};
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(params3.radius,
    params3.tube,
    params3.tubularSegments,
    params3.radialSegments,
    params3.p,
    params3.q),
  mat3
);
mesh3.castShadow = true;
// mesh3.receiveShadow = true;
// add mesh3 to the fourth object
obj3.add(mesh3);
// move the object to the bottom right quadrant
obj3.position.x = (WIDTH / 4);
obj3.position.y = -(WIDTH / 4);
// #endregion

// add the 4 objects to the scene
scene.add(obj0);
scene.add(obj1);
scene.add(obj2);
scene.add(obj3);

// #region The scene's background
// create a plane behind the sphere on which the meshes will cast a shadow
var planeGeometry = new THREE.PlaneBufferGeometry(
  WIDTH + 100, WIDTH + 100, 32, 32
);
var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// push the plane forward (away from the objects and light source)
plane.position.z -= 80;
// set receiveShadow on the plane
// so that the sphere can cast a shadow on the plane
plane.receiveShadow = true;
// add the plane to the scene
scene.add(plane);
// #endregion

// initialize the rotations for the objects
// 30 = 0.5236 rad, 45 = 0.7854
// positive angles cause a counterclockwise rotation and
// negative angles cause a clockwise rotatioon
// increasing the time below would make the rotations slower
const rotations = [0.5236, -0.5236, 0.7854, -0.7854];
const time = 30;
const axis = new THREE.Vector3(0, 0, 1); // the Z-axis

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  // Rotate the objects using the rotation values
  // and time about the Z-axis
  obj0.rotateOnAxis(axis, rotations[0] / time)
  obj1.rotateOnAxis(axis, rotations[1] / time)
  obj2.rotateOnAxis(axis, rotations[2] / time)
  obj3.rotateOnAxis(axis, rotations[3] / time)
  renderer.render(scene, camera);
}

// start the animation routine
animate();
