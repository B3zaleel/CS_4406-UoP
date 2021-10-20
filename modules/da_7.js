"use strict";
import * as THREE from "../libs/three-js/build/three.module.js";
import { OrbitControls } from "../libs/three-js/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "../libs/three-js/examples/jsm/controls/TransformControls.js";

document.title = "Programming Assignment 7 - CS 4406";
// get the DOM element to attach to
const container = document.getElementById("container");

// set the scene size
const WIDTH = Math.min(container.clientWidth, container.clientHeight);
const HEIGHT = Math.min(container.clientWidth, container.clientHeight);

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();

// set some camera attributes
const VIEW_ANGLE = 60,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 1000;

// create the camera for viewing the scene and add it to an Object3D object
const cameraObj = new THREE.Object3D();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
cameraObj.add(camera);
camera.position.z = 30;
cameraObj.lookAt(new THREE.Vector3(0, 0, 0));
// rotate the camera so that the Moon appears to be on the right side of the Earth rather than the top
// cameraObj.rotateOnAxis(
//   new THREE.Vector3(0.577, -0.577, -0.577),
//   THREE.MathUtils.degToRad(120)
// );
// add the camera to the scene
scene.add(cameraObj);
// set up the camera controls.  Please keep in mind that what this does is move the entire scene around.
// because the entire scene is moving the position of the camera and lights in relation to objects within
// the scene doesn't change so the lighting on the surface of the object(s) will not change either
let cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener("mousemove", renderer);
cameraControls.autoRotate = true;

// attach the render-supplied DOM element
// and change the background color to black
container.append(renderer.domElement);
// container.getElementsByTagName("canvas")[0].style.background = "#000000";

// #region The Light Source
// create a point light
let light = new THREE.PointLight(0xffffff, 2.5, 1000);
light.position.set(0, 1, 0);
light.castShadow = true;
// move the light backward along the z-axis
light.position.z = 280;
light.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(light);
// #endregion

// enable the viewport's grid
const gridXZ = new THREE.GridHelper(
  100,
  10,
  new THREE.Color(0xffff00),
  new THREE.Color(0x00ff00)
);
scene.add(gridXZ);
// add an axes helper to the scene
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// the bézier curve
const curve = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-5, 15, 0),
  new THREE.Vector3(20, 15, 0),
  new THREE.Vector3(10, 0, 0)
);
const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({color: 0xff0000});

// Create the curve object to add to the scene
const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// start the animation routine
animate();
