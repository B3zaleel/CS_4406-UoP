"use strict";
import * as THREE from "../libs/three-js/build/three.module.js";
import { OrbitControls } from "../libs/three-js/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "../libs/three-js/examples/jsm/controls/TransformControls.js";

// #region Helper functions
/**
 * Sets the position of an object to the given value
 * @param {THREE.Object3D} obj The object whose position is being changed.
 * @param {{x: Number, y: Number, z: Number}} pos The new position of the object.
 */
const setObjectPosition = (obj, pos)=> {
  if (obj) {
    if ((pos.x != undefined) && (pos.x != null)) {
      obj.position.x = pos.x;
    }
    if ((pos.y != undefined) && (pos.y != null)) {
      obj.position.y = pos.y;
    }
    if ((pos.z != undefined) && (pos.z != null)) {
      obj.position.z = pos.z;
    }
  }
};

const preprocess_fxn = (func_expr, x, y)=> {
  // checks if a character is a number
  const is_number = char=> (char != null) && ((char.charCodeAt(0) >= 48) && (char.charCodeAt(0) <= 57));
  // checks if a character is a letter
  const is_letter = char=> (char != null) && ((char.charCodeAt(0) >= 97) && (char.charCodeAt(0) <= 122));
  const vars = ["x", "y"];
  let buffer = new Array();
  let var_substituted = false;
  let prev_char = null, next_char = null;

  for (let i = 0; i < func_expr.length; i++) {
    while ((func_expr[i] == " ") && (i < func_expr.length)) {
      i++;
    }
    if (i == func_expr.length) {
      break;
    }
    next_char = i < func_expr.length - 1 ? func_expr[i + 1] : null;
    if (vars.includes(func_expr[i]) && (!is_letter(prev_char) && !is_letter(next_char))) {
      if (is_number(prev_char) || (prev_char == ")")) {
        buffer.push("*");
      }
      if (func_expr[i] == 'x') {
        buffer.push(x.toString());
      } else {
        buffer.push(y.toString());
      }
      var_substituted = true;
    } else {
      if (var_substituted && (func_expr[i] == "(")) {
        buffer.push("*");
      }
      buffer.push(func_expr[i]);
      prev_char = func_expr[i];
      var_substituted = false;
    }
  }
  return buffer.join("");
}
// #endregion

// get the required DOM elements
const container = document.getElementById("container");
const graphTypeComboBox = document.getElementById("graph-types");
const fxnInput = document.getElementById("fxn-input");
const fxnSubmit = document.getElementById("fxn-submit");

// set the scene size
const WIDTH = Math.min(container.clientWidth, container.clientHeight);
const HEIGHT = Math.min(container.clientWidth, container.clientHeight);
// set some camera attributes
const VIEW_ANGLE = 60,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 1000
;

// #region Setup the viewport
// create a WebGL renderer, scene, and a camera
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();
// create the camera for viewing the scene and add it to an Object3D object
const cameraObj = new THREE.Object3D();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
cameraObj.add(camera);
cameraObj.name = "camera";
// add the camera to the scene
scene.add(cameraObj);
// set up the camera controls.  Please keep in mind that what this does is move the entire scene around.
// because the entire scene is moving the position of the camera and lights in relation to objects within
// the scene doesn't change so the lighting on the surface of the object(s) will not change either
let cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener("mousemove", renderer);
cameraControls.autoRotate = false;

// attach the render-supplied DOM element
container.append(renderer.domElement);
// #endregion

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
const gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x121212), new THREE.Color(0xababab));
scene.add(gridXZ);
// add an axes helper to the scene
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let Graph_Pos = {x: 0, y: 0, z: 0};
const Min_X = -1;
const Max_X = 1;
const Min_Y = -1;
const Max_Y = 1;
let Custom_Func = "";
const DEFAULT_FXN = "cone";

/**
 * Supported point computing graph functions.
 * For each function:
 *  u {Number}: The current slice division.
 *  v {Number}: The current stack division.
 */
const Graph_Funcs = {
  /**
   * Computes the points for a cone mesh.
   */
  cone: (u, v)=> {
    // the x, z plane (the cone's base) would correspond to the slice section.
    // the y,z plane would correspond to the stack section.
    // the stack is a fraction from 0 to 1, so we use that fraction to
    // change the cone's base radius from its initial to 0 or vice-versa.
    // the radius would be constant for a cylinder.
    const cone_radius = 10;
    const cone_height = 25;
    const r = cone_radius * v;
    const h = cone_height;
    // y corresponds to the cone's vertical axis or height
    // the current value of y from the cone's base is a fraction of the cone's height,
    // so we use the given fraction from the stack fraction to compute y.
    const y = -v * h;
    // convert the percentage of the horizontal division (stack or u)
    // to a fraction of the full circle (2 * Pi)
    const phi = u * 2 * Math.PI;
    // use polar coordinates to compute the coordinates of x and z, which lie
    // on an imaginary circle. and are rotated about an angle, corresponding to
    // the current slice fraction ( a fraction of a full circle).
    const x = -r * Math.cos(phi);
    const z = r * Math.sin(phi);
    Graph_Pos = {x: null, y: cone_height, z: null};
    return {x, y, z};
  },
  /**
   * Computes the points for a cone mesh.
   */
  hyperbolic_paraboloid: (u, v)=> {
    const x = u;
    const y = v;
    const z = (x ** 2) - (y ** 2);
    return {x, y, z};
  },
  /**
   * Computes the points for a radial wave mesh.
   */
  radial_wave: (u, v)=> {
    const wave_radius = 50;
    const r = wave_radius;
    const x = Math.sin(u) * r;
    const z = Math.sin(v / 2) * 2 * r;
    const y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;
    Graph_Pos = {x: null, y: 0, z: null};
    return {x, y, z};
  },
  /**
   * Computes the points for a custom graph function.
   */
  custom: (u, v)=> {
    // u and v are fractions, therefore resolve the fractions
    // to our graph's range and domain
    // compute the spans of the function's x and y axes values
    const spans = {
      x: (Max_X - Min_X),
      y: (Max_Y - Min_Y),
    };
    const signs = {
      x: u < 0.5 ? -1 : 1,
      y: v < 0.5 ? -1 : 1,
    };
    // compute the proportion of the x and y axes spans and add to
    // the minimum position or subtract from the maximum position.
    // reason: (no position can be smaller than the mimimum or greater than the maximum)
    const x = (Min_X + (u * spans.x)); // or x = Max_X - (u * spans.x)
    const y = (Min_Y + (v * spans.y)); // or y = Max_Y - (v * spans.y)
    const proccessed_func = preprocess_fxn(Custom_Func, x, y);
    try {
      const z = mexp.eval(proccessed_func);
      console.log(proccessed_func, "x = ", x, "y = ", y, "z = ", z);
      Graph_Pos = {x: 0, y: 0, z: 0};
      return {x, y, z};
    } catch (Exception) {
      // alert("Invalid expression");
      return {x: 0, y: 0, z: 0};
    }
  },
};

// create the function that calls the parametric point
// computing (graph) function. Graph_Funcs could be any
// of the functions in Graph_Funcs that generate a 3D point
// for a given slice and stack fraction
const generate_points = graph_func=> {
  return function (u, v, target) {
    const pt = graph_func(u, v);
    target.set(pt.x, pt.y, pt.z);
  }
};

// create the material for the graph
const graphMaterial = new THREE.MeshBasicMaterial({
  color: 0x2213ff,
  side: THREE.DoubleSide
});
// Parametic geometry generates a surface inside a 3D box using vertical (stacks)
// and horizontal (slices) divisions that correspond to a point on the surface.
// The stacks and slices correspond to planes and each plane intersects the graph
// or surface at some point. It is the responsibility of the graph function to
// determine what point they intersect at.
// Higher values of stacks and slices are better but it leads to more resource demands.
// slices -> The number of horizontal divisions for each vertical division.
const slices = 10 * (Max_X - Min_X);
// stacks -> The number of vertical divisions.
const stacks = 10 * (Max_Y - Min_Y);
// NB: The slices and stacks are both 20, because we are to use 1/10 increments
// of values between -1 and 1 for both the x and y coordinates. Three.js only
// uses a range from 0 to 1, which is half of the required range span. Therefore,
// we have to double our divisions (slices and stacks) to make up for it.

// create the graph object and name it so it can be searched for and modified
const graphObj = new THREE.Object3D();
graphObj.name = "graph";
scene.add(graphObj);

const resetCameraPosition = name=> {
  cameraControls.reset();
  if (name == "custom") {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;
    cameraObj.lookAt(new THREE.Vector3(0, 0, 0));
    // rotate the camera so that the scene looks like a 2D graph
    cameraObj.rotateX(THREE.MathUtils.degToRad(90));
    // cameraObj.rotateY(THREE.MathUtils.degToRad(0));
  } else {
    camera.position.z = 150;
    cameraObj.lookAt(new THREE.Vector3(0, 0, 0));
    // rotate the camera so that the scene looks 3D
    cameraObj.rotateX(THREE.MathUtils.degToRad(-40));
  }
};

/**
 * Displays a graph with a given name.
 * @param name {String}: The name of the graph to display.
 */
const displayGraph = name=> {
  let func = null;
  if (Object.getOwnPropertyNames(Graph_Funcs).includes(name)) {
    func = Graph_Funcs[name];
  } else {
    alert("Unsupported function");
    return;
  }
  // create the mesh that would contain the parametric geometry
  const graphMesh = new THREE.Mesh(
    new THREE.ParametricGeometry(generate_points(func), slices, stacks),
    graphMaterial
  );
  // replace the the graph object's contents with the new graph mesh
  const obj = scene.getObjectByName("graph");
  obj.clear();
  obj.add(graphMesh);
  setObjectPosition(obj, Graph_Pos);
  resetCameraPosition(name);
};

// #region setting up the graph object's transform controls (gizmo)
const transformControls = new TransformControls(camera, renderer.domElement);
// attach the object to be transformed
transformControls.attach(graphObj);
// set the default transformation mode
transformControls.setMode("rotate");
transformControls.addEventListener("change", () => {
  // the camera controls should be enabled if the
  // transform control isn't dragging the model.
  cameraControls.enabled = !transformControls.dragging;
  animate(); // hasn't been defined but it'll be hoisted
});
// add the transform controls to the scene
scene.add(transformControls);
// track the visibility of the object's gizmo (transform control)
let is_gizmo_visible = true;
// attach the event listener for switching modes based on
// keyboard input in the "container" element
container.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyV":
      if (is_gizmo_visible) {
        transformControls.detach()
        is_gizmo_visible = false;
      } else {
        transformControls.attach(graphObj);
        is_gizmo_visible = true;
      }
      break;
    case "KeyT":
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

// #region setup the graph selection elements
const graph_types = Object.getOwnPropertyNames(Graph_Funcs);
for (let i = 0; i < graph_types.length; i++) {
  const graphTypeOption = document.createElement("option");
  graphTypeOption.value = graph_types[i];
  let val_parts = graph_types[i].split("_");
  val_parts = val_parts.map(val => `${val[0].toLocaleUpperCase()}${val.substr(1)}`);
  graphTypeOption.innerHTML = val_parts.join(" ");
  if (graph_types[i] == DEFAULT_FXN) {
    graphTypeOption.selected = "selected";
  }
  graphTypeComboBox.insertAdjacentElement("beforeend", graphTypeOption);
}

graphTypeComboBox.onchange = ()=> {
  if (graphTypeComboBox.value == "custom") {
    fxnInput.parentElement.parentElement.style.display = "block";
  } else {
    fxnInput.parentElement.parentElement.style.display = "none";
    displayGraph(graphTypeComboBox.value);
  }
};

fxnSubmit.onclick = ()=> {
  Custom_Func = fxnInput.value;
  //build the function execution object
  displayGraph("custom");
};
// #endregion

// Standard functions for rendering the scene.  Notice how we have the animate function
// which submits a call to requestAnimationFrame to call animate.   This creates a loop
// that will render the scene again whenever something within the scene changes.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // console.log("camera position", Camera_Default_Pos);
  // console.log("camera obj position", CameraObj_Default_Pos);
}

// render a cone's graph DEFAULT_FXN
displayGraph(DEFAULT_FXN);
// start the animation routine
animate();
