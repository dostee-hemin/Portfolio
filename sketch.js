let profileImage;
let numberOfDots = 3000;

let c = 0;        //A variable that acts as a scaling factor
let ang = 130;

let types = [];

let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  profileImage = loadImage("/assets/images/Profile Aug 26 2023 - Square.jpg");
  for(let i=0; i<numberOfDots; i++) {
    types.push(int(random(5)));
  }

  colors.push(color(0,255,255));
  colors.push(color(255,255,0));
  colors.push(color(255,0,255));
  colors.push(color(0,255,0));
  colors.push(color(255,100,0));
}

function draw() {
  background(9, 49, 102);

  push();
  translate(width/2,height/2);
  // c = float(mouseY)/height * 60;
  c = lerp(c, 32.1, 0.02);
  ang = lerp(ang, 139.2, 0.1);
  
  for(let i=0; i<numberOfDots; i++) {
    let r = c * sqrt(i);              //Calculate the radius using the equation
    // let theta = i * radians(float(mouseX)/width * 10 + 137.5);   //Calculate the angle using the equation
    let theta = i * radians(ang);   //Calculate the angle using the equation
    
    //Calculate the "x" and "y" poition using Polar to Carteasian transformations
    let x = r * cos(theta);
    let y = r * sin(theta);

    push();
    translate(x,y);
    scale(r/width * 1.5 + 0.5);
    rotate(theta + (i%4 * HALF_PI));
    rectMode(CENTER);
    noFill();
    let baseColor = color(0,100,255);
    
    let distanceToMouse = distSq(mouseX-width/2,mouseY-height/2,x,y);
    let interactionRadius = 200;
    strokeWeight(1);
    if (distanceToMouse < interactionRadius*interactionRadius) {
      let closeness = 1-distanceToMouse/(interactionRadius*interactionRadius);
      let assignedColor = colors[types[i]];
      let colorDifferences = [
        red(assignedColor)-red(baseColor),
        green(assignedColor)-green(baseColor),
        blue(assignedColor)-blue(baseColor)
      ];
      let fadedColor = color(
         red(baseColor)+colorDifferences[0]*closeness,
         green(baseColor)+colorDifferences[1]*closeness,
         blue(baseColor)+colorDifferences[2]*closeness,
      );
      baseColor = fadedColor;
      strokeWeight(1+closeness);
      scale(1+closeness/3);
    }
    stroke(baseColor, r/width * 100 + 155);

    switch(types[i]) {
      case 0:
      rect(0,0,10,40);
      break;
      case 1:
      rect(0,0,20,20);
      break;
      case 2:
      beginShape();
      vertex(5,-15);
      vertex(5,15);
      vertex(-5,15);
      vertex(-5,5);
      vertex(-15,5);
      vertex(-15,-5);
      vertex(-5,-5);
      vertex(-5,-15);
      endShape(CLOSE);
      break;
      case 3:
      rect(-5,5,10,20);
      rect(5,-5,10,20);
      noStroke();
      fill(9,49,102);
      rect(0,0,9,9);
      break;
      case 4:
      rect(0,0,10,30);
      rect(-10,10,10,10);
      noStroke();
      fill(9,49,102);
      rect(-5,10,9,9);
      break;
    }
    pop();
  }
  pop();

  imageMode(CENTER);
  image(profileImage, width/2, height/2, 200, 200);
}

function windowResized() {
  resizeCanvas(windowWidth, height);
}

function distSq(x1,y1, x2,y2) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}