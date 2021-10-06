"use strict";
import * as THREE from "../libs/three-js/build/three.module.js";
import { OrbitControls } from "../libs/three-js/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "../libs/three-js/examples/jsm/controls/TransformControls.js";

document.title = "Programming Assignment 5 - CS 4406";
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
camera.position.z = 150;
cameraObj.lookAt(new THREE.Vector3(0, 0, 0));
// rotate the camera so that the molecule can be seen and transformed
// without the need to rotate the camera (which is currently deactivated)
cameraObj.rotateOnAxis(
  new THREE.Vector3(1, -0.19, -0.19),
  THREE.MathUtils.degToRad(90)
);
// add the camera to the scene
scene.add(cameraObj);

// attach the render-supplied DOM element
container.append(renderer.domElement);

// #region The Light Source
// create a point light
let light = new THREE.PointLight(0xffffff, 1.5, 2000, 2);
light.position.set(0, 0, 0);
light.castShadow = true;
// add the light to the scene
scene.add(light);
// move the light backward
light.position.z = 100;
light.lookAt(new THREE.Vector3(0, 0, 0));
// #endregion

// #region Shared Materials and Parameters
// create the material for the Carbon atom
const carbonMaterial = new THREE.MeshPhongMaterial({
  color: 0xfb1414,
  specular: 0x444444,
  emissive: 0xfb1414,
  shininess: 50,
  reflectivity: 1,
});
// create the material for the Hydrogen atom
const hydrogenMaterial = new THREE.MeshPhongMaterial({
  color: 0x1b14de,
  specular: 0x444444,
  emissive: 0x1b54ae,
  shininess: 100,
  envMap: scene.background,
  combine: THREE.MixOperation,
  reflectivity: 0.5,
});
// create the material for the bonds
const bondCHMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  emissive: 0xd5d5d5,
  specular: 0x444444,
});
// parameters for the Carbon atom's sphere geometry
const carbonGeomParams = {
  radius: 18,
  segments: 32,
  rings: 16,
};
// parameters for the Hydrogen atom's sphere geometry
const hydrogenGeomParams = {
  radius: 10,
  segments: 32,
  rings: 16,
};
// parameters for the Carbon-Hydrogen bond's cylinder geometry
const bondCHParams = {
  radiusTop: 3,
  height: 30,
  radialSegments: 8,
  heightSegments: 1,
  openEnded: true,
};
// #endregion

// Creating the atoms and bonds
// #region Carbon Object
// create a new sphere mesh as the Carbon atom
const carbonObj = new THREE.Object3D();
const carbonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(
    carbonGeomParams.radius,
    carbonGeomParams.segments,
    carbonGeomParams.rings
  ),
  carbonMaterial
);
// make the atom's mesh shadow castable but not receivable
carbonMesh.castShadow = true;
carbonMesh.receiveShadow = false;
// add the carbonMesh to the carbonObj object
carbonObj.add(carbonMesh);
// #endregion

// #region Hydrogen Object 1
// create a new sphere mesh as the Hydrogen atom
const hydrogenObj0 = new THREE.Object3D();
const hydrogenMesh0 = new THREE.Mesh(
  new THREE.SphereGeometry(
    hydrogenGeomParams.radius,
    hydrogenGeomParams.segments,
    hydrogenGeomParams.rings
  ),
  hydrogenMaterial
);
// make the atom's mesh shadow castable but not receivable
hydrogenMesh0.castShadow = true;
hydrogenMesh0.receiveShadow = false;
// move the object upwards along the z-axis to the
// top of the bond mesh below
hydrogenMesh0.position.z = 50;
// create a new cylinder mesh as the bond
const bondCHMesh0 = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bondCHParams.radiusTop,
    bondCHParams.radiusTop,
    bondCHParams.height,
    bondCHParams.radialSegments,
    bondCHParams.heightSegments,
    bondCHParams.openEnded
  ),
  bondCHMaterial
);
// rotate the bond mesh for it to be upright (aligned along the z-axis)
bondCHMesh0.rotateY(THREE.MathUtils.degToRad(90));
bondCHMesh0.rotateZ(THREE.MathUtils.degToRad(90));
// move the bond mesh away from the centre of the Carbon atom's mesh
bondCHMesh0.position.z = 30;
// make the bond mesh shadow castable but not receivable
bondCHMesh0.castShadow = true;
bondCHMesh0.receiveShadow = false;
// add the bondCHMesh0 and hydrogenMesh0 to the hydrogenObj0 object
hydrogenObj0.add(bondCHMesh0);
hydrogenObj0.add(hydrogenMesh0);
// #endregion

// #region Hydrogen Object 2
// create a new sphere mesh as the Hydrogen atom
const hydrogenObj1 = new THREE.Object3D();
const hydrogenMesh1 = new THREE.Mesh(
  new THREE.SphereGeometry(
    hydrogenGeomParams.radius,
    hydrogenGeomParams.segments,
    hydrogenGeomParams.rings
  ),
  hydrogenMaterial
);
// make the atom's mesh shadow castable but not receivable
hydrogenMesh1.castShadow = true;
hydrogenMesh1.receiveShadow = false;
// move the object upwards along the z-axis to the
// top of the bond mesh below
hydrogenMesh1.position.z = 50;
// create a new cylinder mesh as the bond
const bondCHMesh1 = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bondCHParams.radiusTop,
    bondCHParams.radiusTop,
    bondCHParams.height,
    bondCHParams.radialSegments,
    bondCHParams.heightSegments,
    bondCHParams.openEnded
  ),
  bondCHMaterial
);
// rotate the bond mesh for it to be upright (aligned along the z-axis)
bondCHMesh1.rotateY(THREE.MathUtils.degToRad(90));
bondCHMesh1.rotateZ(THREE.MathUtils.degToRad(90));
// move the bond mesh away from the centre of the Carbon atom's mesh
bondCHMesh1.position.z = 30;
// make the bond mesh shadow castable but not receivable
bondCHMesh1.castShadow = true;
bondCHMesh1.receiveShadow = false;
// add the bondCHMesh2 and hydrogenMesh2 to the hydrogenObj2 object
hydrogenObj1.add(bondCHMesh1);
hydrogenObj1.add(hydrogenMesh1);
// rotate the hydrogenObj1 to the bottom and 120° away from
// hydrogenObj0 and 30° anti-clockwise on the (-1, 1, 0) axis
hydrogenObj1.rotateOnAxis(
  new THREE.Vector3(-0.48, -0.832, -0.277),
  THREE.MathUtils.degToRad(129)
);
// #endregion

// #region Hydrogen Object 3
// create a new sphere mesh as the Hydrogen atom
const hydrogenObj2 = new THREE.Object3D();
const hydrogenMesh2 = new THREE.Mesh(
  new THREE.SphereGeometry(
    hydrogenGeomParams.radius,
    hydrogenGeomParams.segments,
    hydrogenGeomParams.rings
  ),
  hydrogenMaterial
);
// make the atom's mesh shadow castable but not receivable
hydrogenMesh2.castShadow = true;
hydrogenMesh2.receiveShadow = false;
// move the object upwards along the z-axis to the
// top of the bond mesh below
hydrogenMesh2.position.z = 50;
// create a new cylinder mesh as the bond
const bondCHMesh2 = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bondCHParams.radiusTop,
    bondCHParams.radiusTop,
    bondCHParams.height,
    bondCHParams.radialSegments,
    bondCHParams.heightSegments,
    bondCHParams.openEnded
  ),
  bondCHMaterial
);
// rotate the bond mesh for it to be upright (aligned along the z-axis)
bondCHMesh2.rotateY(THREE.MathUtils.degToRad(90));
bondCHMesh2.rotateZ(THREE.MathUtils.degToRad(90));
// move the bond mesh away from the centre of the Carbon atom's mesh
bondCHMesh2.position.z = 30;
// make the bond mesh shadow castable but not receivable
bondCHMesh2.castShadow = true;
bondCHMesh2.receiveShadow = false;
// add the bondCHMesh2 and hydrogenMesh2 to the hydrogenObj2 object
hydrogenObj2.add(bondCHMesh2);
hydrogenObj2.add(hydrogenMesh2);
// rotate the hydrogenObj2 to the bottom and 120°
// away from hydrogenObj0 and hydrogenObj1
hydrogenObj2.rotateOnAxis(
  new THREE.Vector3(0.48, -0.832, 0.277),
  THREE.MathUtils.degToRad(129)
);
// #endregion

// #region Hydrogen Object 4
// create a new sphere mesh as the Hydrogen atom
const hydrogenObj3 = new THREE.Object3D();
const hydrogenMesh3 = new THREE.Mesh(
  new THREE.SphereGeometry(
    hydrogenGeomParams.radius,
    hydrogenGeomParams.segments,
    hydrogenGeomParams.rings
  ),
  hydrogenMaterial
);
// make the atom's mesh shadow castable but not receivable
hydrogenMesh3.castShadow = true;
hydrogenMesh3.receiveShadow = false;
// move the object upwards along the z-axis to the
// top of the bond mesh below
hydrogenMesh3.position.z = 50;
// create a new cylinder mesh as the bond
const bondCHMesh3 = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bondCHParams.radiusTop,
    bondCHParams.radiusTop,
    bondCHParams.height,
    bondCHParams.radialSegments,
    bondCHParams.heightSegments,
    bondCHParams.openEnded
  ),
  bondCHMaterial
);
// rotate the bond mesh for it to be upright (aligned along the z-axis)
bondCHMesh3.rotateY(THREE.MathUtils.degToRad(90));
bondCHMesh3.rotateZ(THREE.MathUtils.degToRad(90));
// move the bond mesh away from the centre of the Carbon atom's mesh
bondCHMesh3.position.z = 30;
// make the bond mesh shadow castable but not receivable
bondCHMesh3.castShadow = true;
bondCHMesh3.receiveShadow = false;
// add the bondCHMesh3 and hydrogenMesh3 to the hydrogenObj3 object
hydrogenObj3.add(bondCHMesh3);
hydrogenObj3.add(hydrogenMesh3);
// rotate the hydrogenObj2 to the bottom and 120°
// away from hydrogenObj0 and hydrogenObj1
hydrogenObj3.rotateOnAxis(
  new THREE.Vector3(0.866, -0.0, 0.5),
  THREE.MathUtils.degToRad(180)
);
// #endregion

// #region The Plane Object
// create a plane on which the molecule will cast a shadow
const planeObj = new THREE.Object3D();
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x209f20,
  side: THREE.DoubleSide,
  opacity: 1,
});
var planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(WIDTH * 10, HEIGHT * 10),
  planeMaterial
);
// set receiveShadow on the plane
// so that the sphere can cast a shadow on the plane
planeMesh.receiveShadow = true;
planeObj.add(planeMesh);
// push the plane backward (away from the molecule and light source)
// and adjust its y position (so the molecule appears close
// to the plane's centre)
planeObj.position.z = -50;
planeObj.position.y = -(HEIGHT * 10) / 10;
// #endregion

// #region The Molecule's Label
const moleculeLabel = document.createElement("b");
moleculeLabel.innerHTML = "Methane CH<sub>4</sub>";
moleculeLabel.title = "Methane CH₄";
// set the styles
container.style.position = "relative";
moleculeLabel.style.position = "absolute";
moleculeLabel.style.bottom = `calc(${
  (container.clientHeight - HEIGHT) / 2
}px + 2px)`;
moleculeLabel.style.fontSize = "18px";
moleculeLabel.style.cursor = "pointer";
// add the label to the container, which contains the canvas
// containing our 3D scene
container.append(moleculeLabel);
// #endregion

// add the Carbon and Carbon-Hydrogen bond objects
// to a molecule object that will be added to the
// scene along with the plane
const molecule = new THREE.Object3D();
molecule.add(carbonObj);
molecule.add(hydrogenObj0);
molecule.add(hydrogenObj1);
molecule.add(hydrogenObj2);
molecule.add(hydrogenObj3);
scene.add(molecule);
scene.add(planeObj);

// #region The Model's Controls
// set up the camera controls.
// let cameraControls = new OrbitControls(camera, renderer.domElement);
// cameraControls.addEventListener('mousemove', renderer);
// cameraControls.autoRotate = true;
const transformControls = new TransformControls(camera, renderer.domElement);
// attach the object to be transformed
transformControls.attach(molecule);
// set the default transformation mode
transformControls.setMode("rotate");
transformControls.addEventListener("change", animate);
// add the transform controls to the scene
scene.add(transformControls);

// insert the controls help message
container.insertAdjacentHTML("afterend", '<br/><b>Key Controls</b>'
  + '<ul>'
  + '<li><b>G:</b> Translate model.</li>'
  + '<li><b>R:</b> Rotate model.</li>'
  + '<li><b>S:</b> Scale model.</li>'
  + '</ul>');
// attach the event listener for switching modes based on keyboard input
window.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyG":
      transformControls.setMode("translate");
      break;
    case "KeyR":
      transformControls.setMode("rotate");
      break;
    case "KeyS":
      transformControls.setMode("scale");
      break;
  }
});
// #endregion

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// start the animation routine
animate();
