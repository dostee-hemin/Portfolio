let animator;

function setup() {
  createCanvas(windowWidth, windowHeight*4);

  animator = new Animator();
  animator.startUpWebsite();
  
  setupTetrisPattern();
  setupProjectsSection();
}

function draw() {
  background(3, 25, 54);

  drawTetrisPattern();
  drawProjectsSection();

  // Profile image and outline
  imageMode(CENTER);
  tint(255,animator.profileImageAlpha);
  image(profileImage, width/2, windowHeight/2-animator.profileImageOffset, animator.profileImageSize, animator.profileImageSize);
  noFill();
  stroke(0,0,20);
  strokeWeight(8);
  ellipse(width/2, windowHeight/2-animator.profileImageOffset, animator.profileImageSize, animator.profileImageSize);
  
  // Title text and subtitle text
  noStroke();
  fill(255, animator.titleTextAlpha);
  textSize(60);
  textAlign(CENTER,CENTER);
  text("Dostee Hemin", width/2, windowHeight/2 + 140 - animator.titleTextOffset);
  fill(200, animator.subtitleTextAlpha);
  textSize(30);
  text("Software Engineer", width/2, windowHeight/2 + 200 - animator.subtitleTextOffset);

  // Projects indicator arrow
  push();
  translate(width/2,windowHeight/2+400-animator.projectsArrowOffset);
  stroke(200, animator.projectsArrowAlpha);
  strokeWeight(5);
  line(0,-30,0,30);
  line(-15,15,0,30);
  line(15,15,0,30);

  noStroke();
  fill(200, animator.projectsArrowAlpha);
  textSize(20);
  text("Check Out Projects", 0, -50);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, height);
}