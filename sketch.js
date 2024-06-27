let profileImage;

function setup() {
  createCanvas(windowWidth, windowHeight);

  profileImage = loadImage("./assets/images/Profile Aug 26 2023 - Square.jpg");

  setupTetrisPattern();
}

function draw() {
  background(9, 49, 102);

  drawTetrisPattern();

  imageMode(CENTER);
  image(profileImage, width/2, height/2, 200, 200);
}

function windowResized() {
  resizeCanvas(windowWidth, height);
}