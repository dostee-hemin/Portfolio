let animator;
let lowestYCoordinate = 0;

let mousePos = {"x":0,"y":0};
let prevMousePos = {"x":0,"y":0};
let prevScrollY;
let prevParallaxPosition = 0;
let parallaxPosition = 0;
let scrollY = 0;
let targetScrollY = 0;
let scrollSpeed = 0;
let scrollBarWidth = 0;
let scrollBarColor = 200;

let widthDiv2;
let heightDiv2;
let smallestDimension;
let largestDimension;
let unitSize;

let isMobileDevice = false;
let mobileTetrisPieces = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  windowResized();

  animator = new Animator();
  animator.startUpWebsite();
}

function draw() {
  background(3, 15, 34);

  if(pmouseX != mouseX || pmouseY != mouseY) mousePos = {"x": mouseX, "y": mouseY}
  else mousePos.y += scrollY-prevScrollY;
  parallaxPosition = max(map(scrollY,0,windowHeight/1.5,-unitSize*10,-unitSize*50),-unitSize*50);
  parallaxOffset = parallaxPosition - prevParallaxPosition;

  if(isMobileDevice) {
    if(frameCount % 200 == 0) ripples.push(new Ripple(width/2,heightDiv2-animator.profileImageOffset));
  }

  targetScrollY -= scrollSpeed;
  scrollSpeed *= 0.96;
  targetScrollY = constrain(targetScrollY,0,lowestYCoordinate-height);
  if(isMobileDevice) scrollY = targetScrollY;
  else {
    if(mouseX<width*0.8) canControlScrollBar = false;
    scrollY = lerp(scrollY, targetScrollY, 0.1);
  }
  mousePos.y = mouseY + scrollY;
  push();
  translate(0,-scrollY);

  if(scrollY < windowHeight) {
    push();
    translate(0,scrollY/2);
    drawTetrisPattern();

    // Profile image and outline
    push();
    translate(widthDiv2, heightDiv2-animator.profileImageOffset)
    scale(unitSize*25/profileImage.width * animator.profileImageSize)
    imageMode(CENTER);
    image(profileImage,0,0);
    pop();
    noFill();
    stroke(0,0,20);
    strokeWeight(width*0.004);
    circle(widthDiv2, heightDiv2-animator.profileImageOffset, unitSize*25*animator.profileImageSize);

    // Title text and subtitle text
    noStroke();
    fill(255, animator.titleTextAlpha);
    textSize(unitSize*6);
    textAlign(CENTER,CENTER);
    textFont(fontBold);
    text("Dostee Hemin", widthDiv2, heightDiv2 + unitSize*14 - animator.titleTextOffset);
    fill(200, animator.subtitleTextAlpha);
    textSize(unitSize*3);
    textFont(fontRegular);
    text("Software Engineer", widthDiv2, heightDiv2 + unitSize*20 - animator.subtitleTextOffset);

    // Projects indicator arrow
    push();
    translate(widthDiv2,heightDiv2+unitSize*40-animator.projectsArrowOffset);
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
  text("Contact Me", widthDiv2, lowestYCoordinate-socialsJSON.length*unitSize*6-unitSize*18);
  textFont(fontRegular);
  textSize(unitSize*2.2);
  text("No matter if it's about tech, games, or movies, let's start a chat!\nCheck out my socials below if you want to get in touch.", widthDiv2, lowestYCoordinate-socialsJSON.length*unitSize*6-unitSize*10);
  
  for(let i=0; i<cards.length; i++) {
    let card = cards[i];

    card.y += parallaxOffset;
    if(card.isNotVisible()) continue;
    card.update();
    card.display();
}

  if(scrollY > height-socialLinks.length*60-windowHeight) {
    for(let i=0; i<socialLinks.length; i++) {
      let s = socialLinks[i];

      s.display();
      s.update();
    }
  }
  pop();

  if(!isMobileDevice) {
    scrollBarWidth = lerp(scrollBarWidth, (mouseX>width-unitSize*2)?unitSize*2:unitSize, 0.2);
    let scrollBarHeight = unitSize*8;
    let scrollBarY = map(scrollY,0,lowestYCoordinate-windowHeight,scrollBarHeight/2,height-scrollBarHeight/2);
    stroke(70);
    strokeWeight(scrollBarWidth);
    line(width-unitSize/2,0,width-unitSize/2,height);
    scrollBarColor = lerp(scrollBarColor, ((mouseX > width-unitSize*2 && abs(mouseY-scrollBarY) < scrollBarHeight/2) || canControlScrollBar)?150:220, 0.1);
    stroke(scrollBarColor);
    strokeWeight(scrollBarWidth*0.7);
    line(width-unitSize/2,scrollBarY-scrollBarHeight/2,width-unitSize/2,scrollBarY+scrollBarHeight/2)
    if(canControlScrollBar) {
      targetScrollY = map(mouseY,scrollBarHeight/2, windowHeight-scrollBarHeight/2,0,lowestYCoordinate-windowHeight);
      scrollY = targetScrollY;
      scrollY = constrain(scrollY,0,lowestYCoordinate-height);
    }
  }
  
  
  prevScrollY = scrollY;
  prevMousePos.x = mousePos.x;
  prevMousePos.y = mousePos.y;
  prevParallaxPosition = parallaxPosition;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reset the calculation of where the lowest point on the page is
  lowestYCoordinate = 0;
  
  // Calculate all the resolution variables again
  widthDiv2 = width/2;
  heightDiv2 = windowHeight/2;
  smallestDimension = min(width,windowHeight);
  largestDimension = max(width,windowHeight);
  if (isMobileDevice) unitSize = smallestDimension*0.014
  else unitSize = smallestDimension*0.011
  
  // Setup all parts of the scene again with the new screen dimensions
  setupTetrisPattern();
  setupProjectsSection();
  setupExperienceTree();
  setupSocialLinks();

  if (animator != null)
  animator.endStartUpAnimation();
}

function distSq(x1, y1, x2, y2) {
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
}

