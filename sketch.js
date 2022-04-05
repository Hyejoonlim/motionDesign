// preset values until file is loaded (useful for testing)
//following are four quaternion coordinates for positions 0 to 3.
let quaternions = [
   [0.68269, 0.34134, 0.40961, 0.49964],
   [-0.14779, 0.08867, -0.29557, 0.93964],
   [0.00000, -0.34215, 0.00000, 0.93964],
   [-0.51085, -0.25542, -0.51085, 0.64252]
]


//following are translation vectors for for positions 0 to 3.
let vectors = [
  [-50, -52, 0.0, 0.00],
  [-64, 35, 1.5, 0.00],
  [25, 100, 10, 0.00],
  [95, 30, -15, 0.00]
]

let n = 4; //# of poses
let input;
let scalar, scalarLabel;
let slider, sliderLabel;
let resolution;

let controlPositionsCB;
let controlLabelsCB;
let screwCB;
let bezierCB;
let affineCB;

//Loading text font
let myFont;
function preload() {
  myFont = loadFont('assets/Inconsolata.otf');
}

function setup() {
  createCanvas(600, 400, WEBGL);
  input = createFileInput(handleFile);
  
  controlPositionsCB = createCheckbox('Show Control Positions', true)
  controlLabelsCB = createCheckbox('Show Control Position Labels', true)
  screwCB = createCheckbox('Show Screw Motion', false)
  bezierCB = createCheckbox('Show Bezier Motion', false)
  affineCB = createCheckbox('Show Affine Motion', false)
  
}

function draw() {
  background('black');
  orbitControl();
 // drawFrame(50, 5);
  
  if (quaternions){
    let tempq = quaternions, tempv = vectors;
   
    let dualQuatArray = [];
    
    for(let i=0; i<n; i++){
      dualQuatArray.push(dualQuaternion(tempq[i], tempv[i]));
    }
    
    if (controlPositionsCB.checked())
      drawControlPositions(tempq, tempv);
    
    if (controlLabelsCB.checked())
      drawControlLabels(tempq, tempv); 

    if (screwCB.checked())
      screwMotion(tempq, tempv); 

    if (bezierCB.checked())
      bezierMotion(tempq, tempv); 
    
    if (affineCB.checked())
      affineMotion(tempq, tempv); 
 
  }
}

function drawControlPositions(quaternions, vectors) {
  
  for(let i=0; i<n; i++){
    const Q = quaternions[i];
    const d = vectors[i];
    const dualQuat = dualQuaternion(Q, d);
    push()
    // moves to position and sets orientation extracted from dual quaternion
    drawObject(dualQuat)
    // draw coordinate frame at this position with set orientation
    drawFrame(20, 2)
    pop()
  }
}

function drawControlLabels(quaternions, vectors) {
  textFont(myFont);
  fill('yellow');
  textSize(18);
  textAlign(CENTER);
  
  for(let i=0; i<n; i++){
    const Q = quaternions[i];
    const d = vectors[i];
    const dualQuat = dualQuaternion(Q, d);
    push();
    // moves to position and sets orientation extracted from dual quaternion
    drawObject(dualQuat);
    // draw coordinate frame at this position with set orientation
    translate(0,-25,0);
    text(i, 0, 0);
    pop();
  }
}

function drawFrame(length, sw) {
  strokeWeight(sw);
  stroke("blue");
  line(0.0, 0.0, 0.0, length, 0.0, 0.0); // x-axis
  stroke("green");
  line(0.0, 0.0, 0.0, 0.0, -length, 0.0); //y-axis
  stroke("purple");
  line(0.0, 0.0, 0.0, 0.0, 0.0, length); //z-axis
} 

function drawScrewFrame(length, sw) {
  strokeWeight(sw);
  stroke("#F3FF00");
  line(0.0, 0.0, 0.0, length, 0.0, 0.0); // x-axis
  stroke("#F3FF00");
  line(0.0, 0.0, 0.0, 0.0, -length, 0.0); //y-axis
  stroke("#F3FF00");
  line(0.0, 0.0, 0.0, 0.0, 0.0, length); //z-axis
} 

function drawBezierFrame(length, sw) {
  strokeWeight(sw);
  stroke("#FC00FF");
  line(0.0, 0.0, 0.0, length, 0.0, 0.0); // x-axis
  stroke("#FC00FF");
  line(0.0, 0.0, 0.0, 0.0, -length, 0.0); //y-axis
  stroke("#FC00FF");
  line(0.0, 0.0, 0.0, 0.0, 0.0, length); //z-axis
}
function drawAffineFrame(length, sw) {
  strokeWeight(sw);
  stroke("#00E4FF");
  line(0.0, 0.0, 0.0, length, 0.0, 0.0); // x-axis
  stroke("#00E4FF");
  line(0.0, 0.0, 0.0, 0.0, -length, 0.0); //y-axis
  stroke("#00E4FF");
  line(0.0, 0.0, 0.0, 0.0, 0.0, length); //z-axis
}
// returns dual quaternion representation of quaternion and vector
function dualQuaternion(Q, d) {
  const holder = [
      [0, -d[2], d[1], d[0]],
      [d[2], 0, -d[0], d[1]],
      [-d[1], d[0], 0, d[2]],
      [-d[0], -d[1], -d[2], 0],
    ];
  let Q0 = math.multiply(math.multiply(0.5, holder), [
      [Q[0]],
      [Q[1]],
      [Q[2]],
      [Q[3]],
    ]);
  Q0 = [Q0[0][0], Q0[1][0], Q0[2][0], Q0[3][0]];
  return {real: Q, dual: Q0};
}

function drawObject(dualQuaternion){
  const Q = dualQuaternion.real;
  const Q0 = dualQuaternion.dual;
  
  // calculate position vector
  
  const Q1 = Q[0],
    Q2 = Q[1],
    Q3 = Q[2],
    Q4 = Q[3];
  
  const Q01 = Q0[0],
    Q02 = Q0[1],
    Q03 = Q0[2],
    Q04 = Q0[3];
  
  let S2 = Q1 ** 2 + Q2 ** 2 + Q3 ** 2 + Q4 ** 2;
  
  const matrix = [
    [Q04 * Q1 - Q01 * Q4 + Q02 * Q3 - Q03 * Q2],
    [Q04 * Q2 - Q02 * Q4 + Q03 * Q1 - Q01 * Q3],
    [Q04 * Q3 - Q03 * Q4 + Q01 * Q2 - Q02 * Q1],
  ];
  
  let d = math.multiply(2 / S2, matrix);
  d = [d[0][0], d[1][0], d[2][0]]
  
  // calculate rotation matrix
  // euler rodrigues parameters squared
  const Q12 = Q1 ** 2,
    Q22 = Q2 ** 2,
    Q32 = Q3 ** 2,
    Q42 = Q4 ** 2;

  // Rotation Matrix [R]
  const R11 = (1 / S2) * (Q42 + Q12 - Q22 - Q32);
  const R12 = (2 / S2) * (Q1 * Q2 - Q4 * Q3);
  const R13 = (2 / S2) * (Q1 * Q3 + Q4 * Q2);
  const R21 = (2 / S2) * (Q2 * Q1 + Q4 * Q3);
  const R22 = (1 / S2) * (Q42 - Q12 + Q22 - Q32);
  const R23 = (2 / S2) * (Q2 * Q3 - Q4 * Q1);
  const R31 = (2 / S2) * (Q3 * Q1 - Q4 * Q2);
  const R32 = (2 / S2) * (Q3 * Q2 + Q4 * Q1);
  const R33 = (1 / S2) * (Q42 - Q12 - Q22 + Q32);
  
  const rotMatrix = [
      [R11, R12, R13],
      [R21, R22, R23],
      [R31, R32, R33],
    ];
  
  const homogenousMatrix = [
      [R11, R12, R13, d[0]],
      [R21, R22, R23, d[1]],
      [R31, R32, R33, d[2]],
      [0.0, 0.0, 0.0, 1.0]
    ];
  applyMatrix(R11, R12, R13, 0.0,
              R21, R22, R23, 0.0,
              R31, R32, R33, 0.0,
              d[0], d[1], d[2], 1.0)
}

// handles data parsing after choosing file 
function handleFile(file) {
  let data = file.data
  let result = data.split(" ").join(', ').split('\t').join(', ').split(', ')
  let temp = []
  let counter = 0, Counter = 0;
  quaternions = [];
  vectors = []
  for(let i=0; i<result.length; i++){
    if(i==0) n=parseInt(result[i])
    else {
      if(Counter<n){
        if(counter==4) {
          counter=0
          quaternions.push(temp)
          Counter++
          temp = []
        }
        if(Number(parseFloat(result[i])) || parseFloat(result[i])==0) {
          temp.push(parseFloat(result[i]))
          counter++
        }
      }else{
        if(counter==4) {
          counter=0
          vectors.push(temp)
          Counter++
          temp = []
        }
        if(Number(parseFloat(result[i])) || parseFloat(result[i])==0) {
          temp.push(parseFloat(result[i]))
          counter++
        }
      }
    }
    if(i==result.length-1)
      vectors.push(temp)
  }
}

// get homogenousMatrix from dualQuaternion
function homogenousMatrix (dualQuaternion) {
  const Q = dualQuaternion.real;
  const Q0 = dualQuaternion.dual;
  // calculate position vector
  const Q1 = Q[0],
    Q2 = Q[1],
    Q3 = Q[2],
    Q4 = Q[3];
  const Q01 = Q0[0],
    Q02 = Q0[1],
    Q03 = Q0[2],
    Q04 = Q0[3];
  let S2 = Q1 ** 2 + Q2 ** 2 + Q3 ** 2 + Q4 ** 2;
  const matrix = [
    [Q04 * Q1 - Q01 * Q4 + Q02 * Q3 - Q03 * Q2],
    [Q04 * Q2 - Q02 * Q4 + Q03 * Q1 - Q01 * Q3],
    [Q04 * Q3 - Q03 * Q4 + Q01 * Q2 - Q02 * Q1],
  ];
  let d = math.multiply(2 / S2, matrix);
  d = [d[0][0], d[1][0], d[2][0]]
  
  // calculate rotation matrix
  // euler rodrigues parameters squared
  const Q12 = Q1 ** 2,
    Q22 = Q2 ** 2,
    Q32 = Q3 ** 2,
    Q42 = Q4 ** 2;

  // Rotation Matrix [R]
  const R11 = (1 / S2) * (Q42 + Q12 - Q22 - Q32);
  const R12 = (2 / S2) * (Q1 * Q2 - Q4 * Q3);
  const R13 = (2 / S2) * (Q1 * Q3 + Q4 * Q2);
  const R21 = (2 / S2) * (Q2 * Q1 + Q4 * Q3);
  const R22 = (1 / S2) * (Q42 - Q12 + Q22 - Q32);
  const R23 = (2 / S2) * (Q2 * Q3 - Q4 * Q1);
  const R31 = (2 / S2) * (Q3 * Q1 - Q4 * Q2);
  const R32 = (2 / S2) * (Q3 * Q2 + Q4 * Q1);
  const R33 = (1 / S2) * (Q42 - Q12 - Q22 + Q32);
  
  const rotMatrix = [
      [R11, R12, R13],
      [R21, R22, R23],
      [R31, R32, R33],
    ];
  
  const homogenousMatrix = [
      [R11, R12, R13, d[0]],
      [R21, R22, R23, d[1]],
      [R31, R32, R33, d[2]],
      [0.0, 0.0, 0.0, 1.0]
    ];
  return homogenousMatrix
}
// get position from dual quaternion
function dFromDual (dualQuaternion) {
    const Q = dualQuaternion.real;
    const Q0 = dualQuaternion.dual;
    const Q1 = Q[0],
      Q2 = Q[1],
      Q3 = Q[2],
      Q4 = Q[3];
    const Q01 = Q0[0],
      Q02 = Q0[1],
      Q03 = Q0[2],
      Q04 = Q0[3];
    const S2 = Q1 ** 2 + Q2 ** 2 + Q3 ** 2 + Q4 ** 2;
    const matrix = [
      [Q04 * Q1 - Q01 * Q4 + Q02 * Q3 - Q03 * Q2],
      [Q04 * Q2 - Q02 * Q4 + Q03 * Q1 - Q01 * Q3],
      [Q04 * Q3 - Q03 * Q4 + Q01 * Q2 - Q02 * Q1],
    ];
    const d = math.multiply(2 / S2, matrix);

    return [d[0][0], d[1][0], d[2][0]];
  };