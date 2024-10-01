let animator;
let lowestYCoordinate = 0;

let mousePos = {"x":0,"y":0};
let prevMousePos = {"x":0,"y":0};
let prevScrollY;
let prevParallaxPosition = 0;
let parallaxPosition = 0;
let frameRates = [];

let widthDiv2;
let heightDiv2;
let smallestDimension;
let largestDimension;
let unitSize;

let isMobileDevice = false;
let mobileTetrisPieces = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  isMobileDevice = displayWidth < displayHeight;
  
  windowResized();
  setupTetrisPattern();

  animator = new Animator();
  animator.startUpWebsite();
}

function draw() {
  background(3, 15, 34);
  if(isMobileDevice) {
    if(frameCount % 30 == 0) {
      mobileTetrisPieces.push(new BackgroundPiece(true));
    }
    
    // Loop through all background pieces to update and display them
    for(let i=mobileTetrisPieces.length-1; i>=0; i--) {
      let piece = mobileTetrisPieces[i];
      // Assign the values of the current piece and display it to the screen
      piece.update();
      piece.display();
      if(piece.location.y > height+pieceBaseLength*4) mobileTetrisPieces.splice(i,1);
    }

    fill(255);
    noStroke();
    textFont(fontBold);
    textSize(unitSize*7);
    textAlign(CENTER, CENTER);
    text("Whoops!", width/2, windowHeight/2);
    textFont(fontRegular);
    textSize(unitSize*3);
    text("The mobile version of this website is currently in development...\nTry opening this page on your desktop.", width/2, windowHeight/2+unitSize*10)
    return;
  }

  if(pmouseX != mouseX || pmouseY != mouseY) mousePos = {"x": mouseX, "y": mouseY}
  else mousePos.y += window.scrollY-prevScrollY;
  parallaxPosition = max(map(window.scrollY,0,windowHeight/1.5,-unitSize*10,-unitSize*50),-unitSize*50);
  parallaxOffset = parallaxPosition - prevParallaxPosition;

  if(window.scrollY < windowHeight) {
    push();
    translate(0,window.scrollY/2);
    drawTetrisPattern();

    // Profile image and outline
    imageMode(CENTER);
    tint(255,animator.profileImageAlpha);
    image(profileImage, widthDiv2, heightDiv2-animator.profileImageOffset, animator.profileImageSize, animator.profileImageSize);
    noFill();
    stroke(0,0,20);
    strokeWeight(width*0.004);
    ellipse(widthDiv2, heightDiv2-animator.profileImageOffset, animator.profileImageSize, animator.profileImageSize);
    
    // Title text and subtitle text
    noStroke();
    fill(255, animator.titleTextAlpha);
    textSize(unitSize*6);
    textAlign(CENTER,CENTER);
    textFont(fontBold);
    text("Dostee Hemin", widthDiv2, heightDiv2 + width*0.073 - animator.titleTextOffset);
    fill(200, animator.subtitleTextAlpha);
    textSize(unitSize*3);
    textFont(fontRegular);
    text("Software Engineer", widthDiv2, heightDiv2 + width*0.104 - animator.subtitleTextOffset);

    // Projects indicator arrow
    push();
    translate(widthDiv2,heightDiv2+width*0.208-animator.projectsArrowOffset);
    stroke(200, animator.projectsArrowAlpha);
    strokeWeight(unitSize/2);
    let v1 = unitSize*3
    let v2 = unitSize*1.5
    line(0,-v1,0,v1);
    line(-v2,v2,0,v1);
    line(v2,v2,0,v1);
  
    noStroke();
    fill(200, animator.projectsArrowAlpha);
    textSize(unitSize*2);
    text("Check Out Projects", 0, -unitSize*5);
    pop();
    pop();
  }


  drawExperienceTree();

  push();
  translate(0,parallaxPosition);
  drawProjectsSection();  
  pop();
  
  // Socials title and subtitle
  noStroke();
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(unitSize*5);
  textFont(fontBold);
  text("Contact Me", widthDiv2, height-socialsJSON.length*unitSize*6-unitSize*18);
  textFont(fontRegular);
  textSize(unitSize*2.2);
  text("No matter if it's about tech, games, or movies, let's start a chat!\nCheck out my socials below if you want to get in touch.", widthDiv2, height-socialsJSON.length*unitSize*6-unitSize*10);
  
  for(let i=0; i<cards.length; i++) {
    let card = cards[i];

    card.y += parallaxOffset;
    if(card.isNotVisible()) continue;
    card.update();
    card.display();
}

  if(window.scrollY > height-socialLinks.length*60-windowHeight) {
    for(let i=0; i<socialLinks.length; i++) {
      let s = socialLinks[i];

      s.display();
      s.update();
    }
  }
  
  
  prevScrollY = window.scrollY;
  prevMousePos.x = mousePos.x;
  prevMousePos.y = mousePos.y;
  prevParallaxPosition = parallaxPosition;

  frameRates.push(frameRate())
  if (frameRates.length > 40) {
      frameRates.shift();
  }
  let avgFrameRate = 0;
  for(let f=0; f<frameRates.length; f++) {
      avgFrameRate += frameRates[f];
  }
  avgFrameRate /= frameRates.length;
  console.log(round(avgFrameRate));
}

function windowResized() {
  // Change the width of the screen
  if(!isMobileDevice) resizeCanvas(windowWidth, height);
  // Reset the calculation of where the lowest point on the page is
  lowestYCoordinate = 0;

  // Calculate all the resolution variables again
  widthDiv2 = width/2;
  heightDiv2 = windowHeight/2;
  smallestDimension = min(width,windowHeight);
  largestDimension = max(width,windowHeight);
  unitSize = largestDimension*0.005;
  
  // Setup all parts of the scene again with the new screen dimensions
  setupTetrisPattern();
  setupProjectsSection();
  setupExperienceTree();
  setupSocialLinks();

  if(!isMobileDevice) resizeCanvas(width, lowestYCoordinate);

  if (animator != null)
  animator.endStartUpAnimation();
}

// Function called once every time the mouse is pressed
function mousePressed() {
  // Start a new ripple animation at the cursor's current location
  if(window.scrollY < windowHeight) ripples.push(new Ripple(mousePos.x,mousePos.y));

  if(mouseButton != LEFT) return;
  // If the user clicks on a card that's being hovered, move to the link related to that card
  for(let i=0; i<cards.length; i++) {
    if(cards[i].isUnderMouse()) window.location.href = cards[i].link;
  }

  for(let i=0; i<socialLinks.length; i++) {
    if(socialLinks[i].isUnderMouse()) window.location.href = socialLinks[i].link;
  }

  for(let i=0; i<experiences.length; i++) {
    if(experiences[i].isUnderMouse()) window.location.href = experiences[i].info['link'];
  }
}

function distSq(x1, y1, x2, y2) {
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
}