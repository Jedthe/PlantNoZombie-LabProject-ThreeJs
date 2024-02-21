import * as THREE from "three";
import { GLTFLoader } from "gltf";
import { TextGeometry } from "textGeo";
import { FontLoader } from "fontLoader";
import { OrbitControls } from "orbitController";

let scene,
  renderer,
  skyValue = 1;

let cam,
  camIndex = 0,
  currCam,
  camList = [];
let raycast = new THREE.Raycaster();
let control, spotLight, head, ball, box, skyBoks;
let width = window.innerWidth;
let height = window.innerHeight;

const initCam = () => {
  let aspect = width / height;
  let fov = 45;
  camList[0] = new THREE.PerspectiveCamera(fov, aspect);
  camList[0].position.set(0, 15, 55);
  camList[0].lookAt(0, 7, 0);
};

const initCam2 = () => {
  let aspect = width / height;
  let fov = 90;
  camList[1] = new THREE.PerspectiveCamera(fov, aspect);
  camList[1].position.set(-50, 15, 0);
  camList[1].lookAt(0, 15, 0);
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);
};

const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x82bcff);
};

const initAmbientLight = () => {
  let light = new THREE.AmbientLight(0xfffffc, 0.5);
  light.position.set(0, 0, 0);
  light.castShadow = false;
  scene.add(light);
};

const initSpotLight = () => {
  let light = new THREE.SpotLight(0xffffff, 1.2);
  light.position.set(-80, 40, 0);
  light.castShadow = true;

  scene.add(light);
  return light;
};

const createPlane = () => {
  let plane = new THREE.PlaneGeometry(100, 75);
  let loader = new THREE.TextureLoader();
  let texture = loader.load("./Assets/grass.png");

  let mat = new THREE.MeshStandardMaterial({
    map: texture,
  });

  let mesh = new THREE.Mesh(plane, mat);
  mesh.position.set(0, 0, -7.5);
  mesh.rotateX(-Math.PI / 2);
  mesh.receiveShadow = true;
  scene.add(mesh);
};

const createZombie = () => {
  const loader = new GLTFLoader();

  loader.load("./Assets/zombie/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(10, 0, 0);
    object.rotateY(-Math.PI / 4);
    object.scale.set(60, 60, 60);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);

    let boxes = new Object(new THREE.BoxGeometry(2, 5, 3), new THREE.MeshBasicMaterial({ color: 0xffffff }), [12, 10, 0], 0);
    box = boxes.create2();
    box.visible = false;
  });
};

const createFences = () => {
  const loader = new GLTFLoader();

  loader.load("./Assets/fence/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(-40, 8.5, -44);
    object.scale.set(10, 10, 10);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);
  });

  loader.load("./Assets/fence/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(-20, 8.5, -44);
    object.scale.set(10, 10, 10);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);
  });

  loader.load("./Assets/fence/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(0, 8.5, -44);
    object.scale.set(10, 10, 10);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);
  });
  loader.load("./Assets/fence/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(20, 8.5, -44);
    object.scale.set(10, 10, 10);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);
  });

  loader.load("./Assets/fence/scene.gltf", (gltf) => {
    let object = gltf.scene;
    object.position.set(40, 8.5, -44);
    object.scale.set(10, 10, 10);

    object.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    scene.add(object);
  });
};

const textGeo = () => {
  let loader = new FontLoader();

  loader.load("./three.js/examples/fonts/gentilis_bold.typeface.json", function (font) {
    let textGeometry = new TextGeometry("Plants NO Zombies", {
      font: font,
      size: 10,
      height: 3,
    });

    let textMaterial = new THREE.MeshPhongMaterial({ color: 0xccb7b6 });
    let text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(-55, 20, -50);
    scene.add(text);
  });
};

class Object {
  constructor(geo, material, position, rotation) {
    this.geo = geo;
    this.material = material;
    this.position = position;
    this.rotation = rotation;
  }
  create() {
    let object = new THREE.Mesh(this.geo, this.material);
    object.position.set(this.position[0], this.position[1], this.position[2]);
    object.rotateZ(this.rotation);
    object.castShadow = true;
    scene.add(object);
  }
  create2() {
    let object = new THREE.Mesh(this.geo, this.material);
    object.position.set(this.position[0], this.position[1], this.position[2]);
    object.rotateZ(this.rotation);
    object.castShadow = true;
    scene.add(object);
    return object;
  }
}
class skyBox {
  constructor(material) {
    this.material = material;
  }
  create() {
    let skybox = new THREE.BoxGeometry(1000, 1000, 1000);
    let textureLoader = new THREE.TextureLoader();
    let object = new THREE.Mesh(skybox, this.material);
    scene.add(object);
    return object;
  }
}

const createPlant = () => {
  let head = new Object(new THREE.SphereGeometry(2.5, 64), new THREE.MeshPhongMaterial({ color: "#52D017" }), [-30, 10, 0], 0);

  let mouth = new Object(new THREE.CylinderGeometry(0.5, 1, 2.5, 64, 64, false), new THREE.MeshPhongMaterial({ color: "#52D017" }), [-26.5, 10, 0], Math.PI / 2);

  let headTop = new Object(new THREE.ConeGeometry(1, 2.5, 64), new THREE.MeshPhongMaterial({ color: "#43B000" }), [-32.5, 12, 0], Math.PI / 4);

  let eyes1 = new Object(new THREE.SphereGeometry(0.5, 64), new THREE.MeshPhongMaterial({ color: "#000000" }), [-28.5, 11, -1.5], 0);

  let eyes2 = new Object(new THREE.SphereGeometry(0.5, 64), new THREE.MeshPhongMaterial({ color: "#000000" }), [-28.5, 11, 1.5], 0);

  let trunk = new Object(new THREE.CylinderGeometry(0.75, 0.75, 10, 64, 64, false), new THREE.MeshPhongMaterial({ color: "#4BBF15" }), [-30, 5, 0], 0);

  let wallnut = new THREE.CylinderGeometry(4.5, 4.5, 3, 64, 64, false);
  let textureLoader = new THREE.TextureLoader();
  let texture = textureLoader.load("./Assets/wallnut.jpeg");
  let material = new THREE.MeshPhongMaterial({ map: texture, color: "#ffffff" });
  let object = new THREE.Mesh(wallnut, material);

  object.position.set(-17.5, 4.5, 0);
  object.rotateZ(Math.PI / 2);
  object.castShadow = true;
  scene.add(object);

  mouth.create();
  headTop.create();
  eyes1.create();
  eyes2.create();
  trunk.create();
  return head.create2();
};

const mouseListener = (e) => {
  let mouse = {};
  mouse.x = (e.clientX / width) * 2 - 1;
  mouse.y = (e.clientY / height) * -2 + 1;

  raycast.setFromCamera(mouse, currCam);
  let items = raycast.intersectObject(head, true);
  if (items.length > 0 && ball == null) {
    let balls = new Object(new THREE.SphereGeometry(1, 64), new THREE.MeshPhongMaterial({ color: "#52D017" }), [-27, 10, 0], 0);
    ball = balls.create2();
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  if (ball) {
    ball.position.x += 1;
    let pRay = new THREE.Raycaster(ball.position, new THREE.Vector3(1, 1, 0));
    let items = pRay.intersectObject(box, true);
    if (items.length > 0) {
      scene.remove(ball);
      ball = null;
    }
  }
  renderer.render(scene, currCam);
};

const keyboardListener = (e) => {
  let keycode = e.keyCode;
  console.log(keycode);

  if (keycode == 32) {
    skyValue += 1;
    scene.remove(skyBoks);
    createSkybox();
    let x = skyValue % 2;
    if (x === 0) {
      spotLight.intensity = 0.5;
    } else spotLight.intensity = 1.2;
  }
};

const cameraHandler = (e) => {
  let keycode = e.keyCode;
  if (keycode == 99) {
    currCam = camList[(camIndex += 1) % camList.length];
  }
};

const addListener = () => {
  document.addEventListener("keypress", keyboardListener);
  document.addEventListener("click", mouseListener);
  document.addEventListener("keypress", cameraHandler);
};

const createSkybox = () => {
  let textureLoader = new THREE.TextureLoader();
  let day = new skyBox([
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_ft.jpg"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_bk.jpg"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_up.jpg"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_dn.jpg"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_rt.jpg"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/cloudy/bluecloud_lf.jpg"), side: THREE.BackSide }),
  ]);

  let night = new skyBox([
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("./Assets/nightskycolor.png"), side: THREE.BackSide }),
  ]);

  let x = skyValue % 2;
  if (x === 0) {
    scene.remove(skyBoks);
    return night.create();
  } else {
    scene.remove(skyBoks);
    return day.create();
  }
};

const render = () => {
  requestAnimationFrame(render);

  renderer.render(scene, currCam);
};

const orbitController = () => {
  control = new OrbitControls(camList[0], renderer.domElement);
  control.target.set(0, 7, 0);
  currCam.lookAt(0, 7, 0);
};

window.onload = () => {
  initCam();
  initCam2();
  currCam = camList[camIndex];
  initRenderer();
  initScene();
  initAmbientLight();
  spotLight = initSpotLight();
  createZombie();
  createPlane();
  textGeo();
  addListener();
  createFences();
  head = createPlant();
  skyBoks = createSkybox();
  animate();
  render();
  orbitController();
};

window.onresize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  currCam.aspect = width / height;
  currCam.updateProjectionMatrix();
};
