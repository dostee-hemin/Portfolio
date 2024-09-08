let animator;
let lowestYCoordinate = 0;

let mousePos = {"x":0,"y":0};
let prevMousePos = {"x":0,"y":0};
let prevScrollY;

function setup() {
  createCanvas(windowWidth, windowHeight);

  animator = new Animator();
  animator.startUpWebsite();

  setupTetrisPattern();
  setupProjectsSection();
  windowResized();
  setupSocialLinks();
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

  fill(255);
  textAlign(CENTER,CENTER);
  textSize(50);
  textFont(fontBold);
  text("Contact Me", width/2, height-socialsJSON.length*60-180);
  textFont(fontRegular);
  textSize(22);
  text("No matter if it's about tech, games, or movies, let's start a chat!\nCheck out my socials below if you want to get in touch.", width/2, height-socialsJSON.length*60-100);
  
  for(let i=0; i<socialLinks.length; i++) {
    let s = socialLinks[i];

    s.display();
    s.update();
  }

  if(prevMousePos.x != mouseX && prevMousePos.y != mouseY) mousePos = {"x": mouseX, "y": mouseY}
  else mousePos.y += window.scrollY-prevScrollY;
  prevScrollY = window.scrollY;
  prevMousePos.x = mouseX;
  prevMousePos.y = mouseY;
}

function windowResized() {
  // Change the width of the screen
  resizeCanvas(windowWidth, height);

  // Reset the calculation of where the lowest point on the page is
  lowestYCoordinate = 0;

  // Setup all parts of the scene again with the new screen dimensions
  setupProjectsSection();

  // Adjust the height of the website to include the lowest elements on the page
  resizeCanvas(width, lowestYCoordinate + 230 + socialsJSON.length*60);

  setupSocialLinks();
}

// Function called once every time the mouse is pressed
function mousePressed() {
  // Start a new ripple animation at the cursor's current location
  ripples.push(new Ripple(mousePos.x,mousePos.y));

  if(mouseButton != LEFT) return;
  // If the user clicks on a card that's being hovered, move to the link related to that card
  for(let i=0; i<cards.length; i++) {
    if(cards[i].isUnderMouse()) window.location.href = cards[i].link;
  }

  for(let i=0; i<socialLinks.length; i++) {
    if(socialLinks[i].isUnderMouse()) window.location.href = socialLinks[i].link;
  }
}