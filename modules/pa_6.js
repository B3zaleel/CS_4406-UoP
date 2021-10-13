"use strict";
import * as THREE from "../libs/three-js/build/three.module.js";
import { OrbitControls } from "../libs/three-js/examples/jsm/controls/OrbitControls.js";

document.title = "Programming Assignment 6 - CS 4406";
// get the DOM element to attach to
const container = document.getElementById("container");

// set the scene size
const WIDTH = Math.min(container.clientWidth, container.clientHeight);
const HEIGHT = Math.min(container.clientWidth, container.clientHeight);

// set some camera attributes
const VIEW_ANGLE = 60,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 1000;

// create a WebGL renderer, camera, and a scene
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();

// create the camera for viewing the scene and add it to an Object3D object
const cameraObj = new THREE.Object3D();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
cameraObj.add(camera);
camera.position.z = 200;
cameraObj.lookAt(new THREE.Vector3(0, 0, 0));
// rotate the camera so that the Moon appears to be on the right side of the Earth rather than the top
cameraObj.rotateOnAxis(
  new THREE.Vector3(0.577, -0.577, -0.577),
  THREE.MathUtils.degToRad(120)
  );
// add the camera to the scene
scene.add(cameraObj);
// set up the camera controls.  Please keep in mind that what this does is move the entire scene around.
// because the entire scene is moving the position of the camera and lights in relation to objects within
// the scene doesn't change so the lighting on the surface of the object(s) will not change either
let cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener('mousemove', renderer);
cameraControls.autoRotate = true;

// attach the render-supplied DOM element
// and change the background color to black
container.append(renderer.domElement);
container.getElementsByTagName('canvas')[0].style.background = '#000000';

// #region The Light Source
// create a point light
let light = new THREE.PointLight(0xffffff, 2.5, 1000);
light.position.set(0, 1, 0);
light.castShadow = true;
// move the light backward along the z-axis
light.position.z = 280;
light.lookAt(new THREE.Vector3(0, 0, 0));
// rotate the light to be positioned on the right side of the scene
light.rotateOnAxis(
  new THREE.Vector3(-0.250, 0.682, 0.688),
  THREE.MathUtils.degToRad(153)
);
// add the light to the scene
scene.add(light);
// #endregion

// #region Materials and Parameters
// create the material for the Earth
const earthTexture = new THREE.TextureLoader().load('../textures/earth_texture_1.jpg');
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  side: THREE.DoubleSide,
});
// create the material for the Moon
const moonTexture = new THREE.TextureLoader().load('../textures/moon_texture_0.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  side: THREE.DoubleSide,
});
// parameters for the Earth's sphere geometry
const earthGeomParams = {
  radius: 40,
  segments: 32,
  rings: 16,
};
// parameters for the Moon's sphere geometry
const moonGeomParams = {
  radius: 10,
  segments: 32,
  rings: 16,
};
// #endregion

// #region Earth Object
// create a new sphere mesh to represent the Earth
const earthObj = new THREE.Object3D();
const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(
    earthGeomParams.radius,
    earthGeomParams.segments,
    earthGeomParams.rings
    ),
    earthMaterial
    );
    // make the Earths's mesh shadow receivable but not castable
    earthMesh.castShadow = false;
    earthMesh.receiveShadow = true;
    // add the earthMesh to the earthObj object
    earthObj.add(earthMesh);
    // #endregion

    // #region Moon Object
    // create a new sphere mesh to represent the Moon
    const moonObj = new THREE.Object3D();
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(
    moonGeomParams.radius,
    moonGeomParams.segments,
    moonGeomParams.rings
  ),
  moonMaterial
  );
  // make the Moon's mesh shadow castable but not receivable
  moonMesh.castShadow = true;
moonMesh.receiveShadow = false;
// move the moon away from the Earth's centre (Earth's radius + 30 pixels)
moonObj.position.z = 40 + 30;
// add the moonMesh to the moonObj object
moonObj.add(moonMesh);
// #endregion

// add the Earth and Moon objects to the scene
scene.add(earthObj);
scene.add(moonObj);

// parameters for simulating the Moon's spin and orbit around the Earth
// and the Earth's spinning
// I used polar (or spherical but I used only two axes) coordinates
// to simulate the Moon's orbit around the Earth
// the distance from the world origin to the Moon's centre
const rad = 40 + 30;
// the angle the Moon moves relative to the Earth's centre per second
const phi_eps = 25;
// the number of frames per second
const fps = 30;
// the cummulative translation of the Moon in polar angle
let phi = 0
// the angle of rotation of the Moon in degrees
const moon_rot = 15/7;
// the angle of rotation of the Earth in degrees
const earth_rot = 15/30;

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  // The Earth's spinning
  earthObj.rotateOnWorldAxis(
    new THREE.Vector3(0, 1, 0),
    THREE.MathUtils.degToRad(earth_rot)
    );
    // The Moon's spinning
    moonObj.rotateOnWorldAxis(
      new THREE.Vector3(0, 1, 0),
      THREE.MathUtils.degToRad(moon_rot)
      );
      // The Moon's orbit (using polar coordinates to translate the Moon)
  moonObj.position.x = -rad * Math.cos(THREE.MathUtils.degToRad(phi));
  moonObj.position.z = rad * Math.sin(THREE.MathUtils.degToRad(phi));
  phi += (phi_eps / fps) % 360;
  renderer.render(scene, camera);
}

// start the animation routine
animate();
