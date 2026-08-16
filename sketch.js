let px = 0;
let py = 0;
let pz = 0;

// Quaternion
let qw = 1;
let qx = 0;
let qy = 0;
let qz = 0;

let fov = 270;

// Camera angles
let yaw = 0;
let pitch = 0;

// Locked mouse
const mouse = {
  x: 0,
  y: 0,
  locked: false
};

function use() {
  if (mouse.locked) {
    // Crosshair
    ellipse(width / 2, height / 2, 5, 5);
  }
}

function mouseClicked() {
  if (!mouse.locked) {
    mouse.x = mouseX;
    mouse.y = mouseY;

    resizeCanvas(windowWidth, windowHeight);

    // IMPORTANT: pointer lock first
    requestPointerLock();

    // Fullscreen second
    document.documentElement.requestFullscreen().catch((e) => {
      console.log("Fullscreen:", e);
    });
  }
}

document.addEventListener(
  'pointerlockchange',
  lockChangeUpdate,
  false
);

document.addEventListener(
  'mozpointerlockchange',
  lockChangeUpdate,
  false
);

function lockChangeUpdate() {
  if (
    document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas
  ) {
    mouse.locked = true;

    document.addEventListener(
      "mousemove",
      updatePosition,
      false
    );
  } else {
    document.removeEventListener(
      "mousemove",
      updatePosition,
      false
    );

    mouse.locked = false;
  }
}
function updatePosition(e) {

  // Mouse X = yaw
  yaw += e.movementX * 0.005;

  // Mouse Y = pitch
  pitch -= e.movementY * 0.005;

  // Prevent looking completely upside down
  pitch = constrain(
    pitch,
    -HALF_PI + 0.01,
    HALF_PI - 0.01
  );

  // Rebuild camera rotation
  // X = pitch
  // Y = yaw
  // Z = roll = 0
  setRotation(
    pitch,
    yaw,
    0
  );
}

function setup() {
  createCanvas(400, 400);

  setRotation(0, 0, 0);
}

function draw() {
  background(0);
  use();
  if (Key("esc"))mouse.locked=false

  // Test points
  point1(0, 0, 2);
  point1(1, 0, 2);
  point1(0, 1, 2);
  point1(1, 1, 2); 
  
  point1(0, 0, 3);
  point1(1, 0, 3);
  point1(0, 1, 3);
  point1(1, 1, 3);
}

function point1(x, y, z) {

  let p = ncs(x, y, z);

  if (p.z <= 0) {
    return;
  }

  ellipse(p.x, p.y, 3);
}

function ncs(x, y, z) {

  // Move world relative to player
  x -= px;
  y -= py;
  z -= pz;

  // Inverse camera rotation
  let p = rotateVector(
    x,
    y,
    z,
    qw,
    -qx,
    -qy,
    -qz
  );

  // Behind camera
  if (p.z <= 0) {
    return {
      x: 0,
      y: 0,
      z: p.z
    };
  }

  // Perspective
  let scale = fov / p.z;

  let screenX =
    width / 2 +
    p.x * scale;

  let screenY =
    height / 2 -
    p.y * scale;

  return {
    x: screenX,
    y: screenY,
    z: p.z
  };
}

function setRotation(rx, ry, rz) {

  let qx1 =
    quaternionFromAxisAngle(
      1, 0, 0, rx
    );

  let qy1 =
    quaternionFromAxisAngle(
      0, 1, 0, ry
    );

  let qz1 =
    quaternionFromAxisAngle(
      0, 0, 1, rz
    );

  let q = quaternionMultiply(
    qx1.w,
    qx1.x,
    qx1.y,
    qx1.z,

    qy1.w,
    qy1.x,
    qy1.y,
    qy1.z
  );

  q = quaternionMultiply(
    q.w,
    q.x,
    q.y,
    q.z,

    qz1.w,
    qz1.x,
    qz1.y,
    qz1.z
  );

  qw = q.w;
  qx = q.x;
  qy = q.y;
  qz = q.z;

  normalizeQuaternion();
}

function rotateQuaternion(rx, ry, rz) {

  // X rotation
  let qx1 =
    quaternionFromAxisAngle(
      1, 0, 0, rx
    );

  // Y rotation
  let qy1 =
    quaternionFromAxisAngle(
      0, 1, 0, ry
    );

  // Z rotation
  let qz1 =
    quaternionFromAxisAngle(
      0, 0, 1, rz
    );

  // Apply X
  let q = quaternionMultiply(
    qw,
    qx,
    qy,
    qz,

    qx1.w,
    qx1.x,
    qx1.y,
    qx1.z
  );

  qw = q.w;
  qx = q.x;
  qy = q.y;
  qz = q.z;

  // Apply Y
  q = quaternionMultiply(
    qw,
    qx,
    qy,
    qz,

    qy1.w,
    qy1.x,
    qy1.y,
    qy1.z
  );

  qw = q.w;
  qx = q.x;
  qy = q.y;
  qz = q.z;

  // Apply Z
  q = quaternionMultiply(
    qw,
    qx,
    qy,
    qz,

    qz1.w,
    qz1.x,
    qz1.y,
    qz1.z
  );

  qw = q.w;
  qx = q.x;
  qy = q.y;
  qz = q.z;

  normalizeQuaternion();
}

function quaternionFromAxisAngle(
  ax,
  ay,
  az,
  angle
) {

  let half = angle / 2;

  let s = sin(half);

  return {
    w: cos(half),
    x: ax * s,
    y: ay * s,
    z: az * s
  };
}

function quaternionMultiply(
  w1, x1, y1, z1,
  w2, x2, y2, z2
) {

  return {

    w:
      w1 * w2 -
      x1 * x2 -
      y1 * y2 -
      z1 * z2,

    x:
      w1 * x2 +
      x1 * w2 +
      y1 * z2 -
      z1 * y2,

    y:
      w1 * y2 -
      x1 * z2 +
      y1 * w2 +
      z1 * x2,

    z:
      w1 * z2 +
      x1 * y2 -
      y1 * x2 +
      z1 * w2
  };
}

function normalizeQuaternion() {

  let length = sqrt(
    qw * qw +
    qx * qx +
    qy * qy +
    qz * qz
  );

  qw /= length;
  qx /= length;
  qy /= length;
  qz /= length;
}

function rotateVector(
  x,
  y,
  z,
  w,
  qx,
  qy,
  qz
) {

  // Quaternion * vector
  let ix =
    w * x +
    qy * z -
    qz * y;

  let iy =
    w * y +
    qz * x -
    qx * z;

  let iz =
    w * z +
    qx * y -
    qy * x;

  let iw =
    -qx * x -
    qy * y -
    qz * z;

  // Result * inverse quaternion
  return {

    x:
      ix * w +
      iw * -qx +
      iy * -qz -
      iz * -qy,

    y:
      iy * w +
      iw * -qy +
      iz * -qx -
      ix * -qz,

    z:
      iz * w +
      iw * -qz +
      ix * -qy -
      iy * -qx
  };
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
Key()
function Key(info){
  if (info === "ctrl") { if (keyIsDown(17)) return true; }
  if (info === "control") { if (keyIsDown(17)) return true; }
  if (info === "alt") { if (keyIsDown(18)) return true; }
  if (info === "shift") { if (keyIsDown(16)) return true; }
  if (info === "meta") { if (keyIsDown(91)) return true; }
  if (info === "cmd") { if (keyIsDown(91)) return true; }
  if (info === " ") { if (keyIsDown(32)) return true; }
  if (info === "space") { if (keyIsDown(32)) return true; }
  if (info === "enter") { if (keyIsDown(13)) return true; }
  if (info === "tab") { if (keyIsDown(9)) return true; }
  if (info === "esc") { if (keyIsDown(27)) return true; }
  if (info === "escape") { if (keyIsDown(27)) return true; }
  if (info === "backspace") { if (keyIsDown(8)) return true; }
  if (info === "left") { if (keyIsDown(37)) return true; }
  if (info === "up") { if (keyIsDown(38)) return true; }
  if (info === "right") { if (keyIsDown(39)) return true; }
  if (info === "down") { if (keyIsDown(40)) return true; }
  if (info === "a"||info === "A") { if (keyIsDown(65)) return true; }
  if (info === "b"||info === "B") { if (keyIsDown(66)) return true; }
  if (info === "c"||info === "C") { if (keyIsDown(67)) return true; }
  if (info === "d"||info === "D") { if (keyIsDown(68)) return true; }
  if (info === "e"||info === "E") { if (keyIsDown(69)) return true; }
  if (info === "f"||info === "F") { if (keyIsDown(70)) return true; }
  if (info === "g"||info === "G") { if (keyIsDown(71)) return true; }
  if (info === "h"||info === "H") { if (keyIsDown(72)) return true; }
  if (info === "i"||info === "I") { if (keyIsDown(73)) return true; }
  if (info === "j"||info === "J") { if (keyIsDown(74)) return true; }
  if (info === "k"||info === "K") { if (keyIsDown(75)) return true; }
  if (info === "l"||info === "L") { if (keyIsDown(76)) return true; }
  if (info === "m"||info === "M") { if (keyIsDown(77)) return true; }
  if (info === "n"||info === "N") { if (keyIsDown(78)) return true; }
  if (info === "o"||info === "O") { if (keyIsDown(79)) return true; }
  if (info === "p"||info === "P") { if (keyIsDown(80)) return true; }
  if (info === "q"||info === "Q") { if (keyIsDown(81)) return true; }
  if (info === "r"||info === "R") { if (keyIsDown(82)) return true; }
  if (info === "s"||info === "S") { if (keyIsDown(83)) return true; }
  if (info === "t"||info === "T") { if (keyIsDown(84)) return true; }
  if (info === "u"||info === "U") { if (keyIsDown(85)) return true; }
  if (info === "v"||info === "V") { if (keyIsDown(86)) return true; }
  if (info === "w"||info === "W") { if (keyIsDown(87)) return true; }
  if (info === "x"||info === "X") { if (keyIsDown(88)) return true; }
  if (info === "y"||info === "Y") { if (keyIsDown(89)) return true; }
  if (info === "z"||info === "Z") { if (keyIsDown(90)) return true; }
  if (info === "0") { if (keyIsDown(48)) return true; }
  if (info === "1") { if (keyIsDown(49)) return true; }
  if (info === "2") { if (keyIsDown(50)) return true; }
  if (info === "3") { if (keyIsDown(51)) return true; }
  if (info === "4") { if (keyIsDown(52)) return true; }
  if (info === "5") { if (keyIsDown(53)) return true; }
  if (info === "6") { if (keyIsDown(54)) return true; }
  if (info === "7") { if (keyIsDown(55)) return true; }
  if (info === "8") { if (keyIsDown(56)) return true; }
  if (info === "9") { if (keyIsDown(57)) return true; }
  if (info === "f1") { if (keyIsDown(112)) return true; }
  if (info === "f2") { if (keyIsDown(113)) return true; }
  if (info === "f3") { if (keyIsDown(114)) return true; }
  if (info === "f4") { if (keyIsDown(115)) return true; }
  if (info === "f5") { if (keyIsDown(116)) return true; }
  if (info === "f6") { if (keyIsDown(117)) return true; }
  if (info === "f7") { if (keyIsDown(118)) return true; }
  if (info === "f8") { if (keyIsDown(119)) return true; }
  if (info === "f9") { if (keyIsDown(120)) return true; }
  if (info === "f10") { if (keyIsDown(121)) return true; }
  if (info === "f11") { if (keyIsDown(122)) return true; }
  if (info === "f12") { if (keyIsDown(123)) return true; }
  if (info === "insert") { if (keyIsDown(45)) return true; }
  if (info === "delete") { if (keyIsDown(46)) return true; }
  if (info === "home") { if (keyIsDown(36)) return true; }
  if (info === "end") { if (keyIsDown(35)) return true; }
  if (info === "pageup") { if (keyIsDown(33)) return true; }
  if (info === "pagedown") { if (keyIsDown(34)) return true; }
  if (info === "capslock") { if (keyIsDown(20)) return true; }
  if (info === "numlock") { if (keyIsDown(144)) return true; }
  if (info === "scrolllock") { if (keyIsDown(145)) return true; }
  if (info === ";") { if (keyIsDown(186)) return true; }
  if (info === "=") { if (keyIsDown(187)) return true; }
  if (info === ",") { if (keyIsDown(188)) return true; }
  if (info === "-") { if (keyIsDown(189)) return true; }
  if (info === ".") { if (keyIsDown(190)) return true; }
  if (info === "/") { if (keyIsDown(191)) return true; }
  if (info === "`") { if (keyIsDown(192)) return true; }
  if (info === "[") { if (keyIsDown(219)) return true; }
  if (info === "\\") { if (keyIsDown(220)) return true; }
  if (info === "]") { if (keyIsDown(221)) return true; }
  if (info === "'") { if (keyIsDown(222)) return true; }
  return false
}
