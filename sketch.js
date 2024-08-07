let animator;
let lowestYCoordinate = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  animator = new Animator();
  animator.startUpWebsite();

  setupTetrisPattern();
  setupProjectsSection();
  windowResized();
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
  textFont(fontBold);
  text("Dostee Hemin", width/2, windowHeight/2 + 140 - animator.titleTextOffset);
  fill(200, animator.subtitleTextAlpha);
  textSize(30);
  textFont(fontRegular);
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
  // Change the width of the screen
  resizeCanvas(windowWidth, height);

  // Reset the calculation of where the lowest point on the page is
  lowestYCoordinate = 0;

  // Setup all parts of the scene again with the new screen dimensions
  setupProjectsSection();

  // Adjust the height of the website to include the lowest elements on the page
  resizeCanvas(width, lowestYCoordinate + 100);
}

// Function called once every time the mouse is pressed
function mousePressed() {
  // Start a new ripple animation at the cursor's current location
  ripples.push(new Ripple(mouseX,mouseY));

  // If the user clicks on a card that's being hovered, move to the link related to that card
  for(let i=0; i<cards.length; i++) {
    if(cards[i].isHovering) window.location.href = cards[i].link;
  }
}