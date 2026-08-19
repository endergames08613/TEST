let fov = 500
let p = {x: 0, y: 0, z: -fov, rx: 0, ry: 0, rz: 0}
let pm = {x: 0, y: 0, z: 0}
let faces = []
let zt = 0
let yt = 0
let ny = 0
let yt2 = 0
let b
let t = 0
let wall = 1
let light = {x:0, y:-20, z:10, r:255, g:255, b:255}
let mouseSens = 0.5;  // mouse sensitivity
let mx = 90
function setup() {
  createCanvas(400, 400);
  fill(255)
  noStroke()
  faces[0] = new face(0,0,0,0,0,0,0,0,0);
  faces[1] = new face(0,-10,-10,0,90,255,255,0,0);
  faces[2] = new face(0,-10,10,0,90,0,0,20,0);
  faces[3] = new face(10,-10,0,0,90,0,255,0,0);
  faces[4] = new face(-10,-10,0,0,90,0,0,0,0);


}
const mouse = {
  x: 0,
  y: 0,
  locked: false
}
function mouseClicked() {
  if (!mouse.locked) {
    mouse.locked = true;
    mouse.x = mouseX;
    mouse.y = mouseY;
    requestPointerLock();
  }
          resizeCanvas(windowWidth, windowHeight);
      document.documentElement.requestFullscreen().catch((e) => {});
        resizeCanvas(windowWidth, windowHeight);


}
document.addEventListener('pointerlockchange', lockChangeUpdate, false);
document.addEventListener('mozpointerlockchange', lockChangeUpdate, false);
function lockChangeUpdate() {
  if (document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas) {
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    document.removeEventListener("mousemove", updatePosition, false);
    mouse.locked = false;
  }
} 
function updatePosition(e) {
  // Use raw mouse deltas for camera rotation
  const dx = e.movementX;
  const dy = e.movementY;

  p.rx   -= dx * mouseSens;
  
  p.ry += dy * mouseSens;
if(p.ry>=mx){
  p.ry=mx-1
}
  // // Clamp p.ry
  // const limit = PI/2 - 45;
  // p.ry = Math.max(-900, 900);
}

function draw() {
  background(0); 
  if(ny>= 300){
    ny = 299
  } if(ny<= -300){
    ny = -299
  }
  let d = r3(0, 0, -1, p.rx, p.ry, p.rz, 0, 0, 0);
  let dn = ncs(d.x, d.y, d.z)
  ellipse(dn.x,dn.y - ny,3)
  let fwd = r3(0, 0, -1, p.rx, 0, p.rz, 0, 0, 0);
  let len = Math.sqrt(fwd.x*fwd.x + fwd.y*fwd.y + fwd.z*fwd.z) || 1;
  let dir = { x: fwd.x/len, y: fwd.y/len, z: fwd.z/len };
  let side2 = r3(-1, 0, 0, p.rx, 0, p.rz, 0, 0, 0);
  let len2 = Math.sqrt(side2.x*side2.x + side2.y*side2.y + side2.z*side2.z) || 1;
  let dir2 = { x: side2.x/len2, y: side2.y/len2, z: side2.z/len2 };
  let speed = 1.5; 
  
  if (Key("s")) {
    pm.x += dir.x * speed;
    pm.z -= dir.z * speed*wall;
  }
  if (Key("w")) {
    pm.x -= dir.x * speed;
    pm.z += dir.z * speed*wall;
  }
  if (Key("d")) {
    pm.x += dir2.x * speed; 
    pm.z -= dir2.z * speed*wall; 
  }
  if (Key("a")) { 
    pm.x -= dir2.x * speed;
    pm.z += dir2.z * speed*wall; 
  }  
  if (Key(" ")) { 
    pm.y += 3;
  }
 if (Key("shift")) { 
    pm.y -= 3;
  }

  if(Key("right")) p.rx -= 1
  if(Key("left"))  p.rx += 1  
  if(Key("up"))p.ry-=1
  if(Key("down"))p.ry+=1
  
  
    if(Key("r")){
  p.ry = 0
  p.rz = 0
  }

faces.sort((b, a) => b.disp - a.disp);
for (let i = 0; i < faces.length; i++) {
  faces[i].draw();
}
}
class face{
  constructor(x,y,z,xr,yr,zr,r,g,b,m){
    this.size=1
    this.x=x
    this.y=-y
    this.z=z
    this.xr=xr
    this.yr=yr
    this.zr=zr
    this.point= []
    this.n = []
    this.dis = []
    this.disp = 0
    this.r = r
    this.g = g
    this.b = b
    this.m = m
  }
  
  draw(){
    let m = 0
    this.n[m] = r3(this.x-this.size, this.y-this.size, this.z, this.xr, this.yr, this.zr, this.x, this.y, this.z)
    this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    this.point[m] = points(this.n[m].x,this.n[m].y,this.n[m].z)
    m+=1
    this.n[m] = r3(this.x-this.size,this.y+this.size,this.z, this.xr, this.yr, this.zr, this.x, this.y, this.z)
    this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    this.point[m] = points(this.n[m].x,this.n[m].y,this.n[m].z)
    m+=1   
    this.n[m] = r3(this.x+this.size,this.y+this.size,this.z, this.xr, this.yr, this.zr, this.x, this.y, this.z)
    this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    this.point[m] = points(this.n[m].x,this.n[m].y,this.n[m].z)
    m+=1
    this.n[m] = r3(this.x+this.size,this.y-this.size,this.z,this.xr, this.yr, this.zr, this.x, this.y, this.z)
    this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    this.point[m] = points(this.n[m].x,this.n[m].y,this.n[m].z)
      // m+=1
    // this.n[m] = r3(this.x,this.y,this.z-1,this.xr, this.yr, this.zr, this.x, this.y, this.z)
    // this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    // this.point[m] = points(this.n[m].x,this.n[m].y,this.n[m].z)
    // // console.log(m,this.dis[m])
    //   m+=1
    // this.n[m] = r3(this.x,this.y,this.z,this.xr, this.yr, this.zr, this.x, this.y, this.z)
    // this.dis[m] = sqrt(sq(this.n[m].x-light.x)+sq(this.n[m].y-light.y)+sq(this.n[m].z-light.z))
    // this.disp = sqrt(sq(this.n[m].x-pm.x)+sq(this.n[m].y-pm.y)+sq(this.n[m].z-pm.z))
    // // console.log(m,this.dis[m])

      for(let i = 0; i <= 4; i++){
        // ellipse(this.point[i].x,this.point[i].y,2)
        // console.log(i,this.point[i].x,this.point[i].y)                                                                                                                                                                                      
      }

    // if(this.dis[4]<=this.dis[5]&&light.r+light.g+light.b>0){
    if(this.dis[4]==this.dis[4]){
      fill(light.r-this.r,light.g-this.g,light.b-this.b)
    }else{
      fill(0)
    }
if (this.point.some(p => p.x !== "no")) {
  beginShape();
  vertex(this.point[0].x, this.point[0].y);
  vertex(this.point[1].x, this.point[1].y);
  vertex(this.point[2].x, this.point[2].y);
  vertex(this.point[3].x, this.point[3].y);
  endShape(CLOSE);
}          
      if(pm.x<=this.point[0].x&&pm.x>=this.point[1].x){
      }
      }

    }


function points(x,y,z){
  this.x=x+p.x+pm.x
  this.y=y+p.y+pm.y
  this.z=z+p.z+pm.z
  let a = r3(0, 0, 1, 0, p.rx, 0, 0, 0, 0) 
  this.nn = r3(this.x, this.y, this.z, p.rx, p.ry, p.rz, p.x, p.y, p.z)
  this.nx=this.nn.x
  this.ny=this.nn.y
  this.nz=this.nn.z
  this.nn = ncs(this.nx,this.ny,this.nz)
  this.x=this.nn.x
  this.y=this.nn.y
  this.d = this.nn.d
  return { x: this.x, y: this.y, d: this.d};
}

function ncs(x, y, z) {
  const denom = z + fov;
  if (denom <= 0) return { x: "no"};
  const s = fov / denom;
  // console.log(x * s, y + ny * s)
  return { x: x * s + width / 2, y: y * s + height / 2 + ny};
}


function r3(px, py, pz, ry, rx, rz, centerx, centery, centerz) {
  let x = px - centerx;
  let y = py - centery;
  let z = pz - centerz;

  // rotate Y
  let c = Math.cos(ry/180*PI);
  let s = Math.sin(ry/180*PI);
  let x1 = x * c + z * s;
  let z2 = -x * s + z * c;
  x = x1; z = z2;

  // rotate X
  c = Math.cos(rx/180*PI);
  s = Math.sin(rx/180*PI);
  let y1 = y * c - z * s;
  let z1 = y * s + z * c;
  y = y1; z = z1;

  // rotate Z
  c = Math.cos(rz/180*PI);
  s = Math.sin(rz/180*PI);
  let x2 = x * c - y * s;
  let y2 = x * s + y * c;
  x = x2; y = y2;

  return { x: x + centerx, y: y + centery, z: z + centerz };
}


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
