let canControlScrollBar = false;

// Function called once every time the mouse is pressed
function mousePressed() {
  // Start a new ripple animation at the cursor's current location
  if(scrollY < windowHeight && !isMobileDevice) ripples.push(new Ripple(mousePos.x,mousePos.y));

  if(mouseX>width-unitSize*2 && !canControlScrollBar) canControlScrollBar = true;
  
  if(mouseButton != LEFT) return;
  // If the user clicks on a card that's being hovered, move to the link related to that card
  for(let i=0; i<cards.length; i++) {
    if(cards[i].isUnderMouse()) {
      if (cards[i].link != "") window.location.href = cards[i].link;
    }
  }
  
  for(let i=0; i<socialLinks.length; i++) {
    if(socialLinks[i].isUnderMouse()) window.location.href = socialLinks[i].link;
  }
  
  for(let i=0; i<experiences.length; i++) {
    if(experiences[i].isUnderMouse()) window.location.href = experiences[i].info['link'];
  }

  scrollSpeed = 0;
}

function mouseDragged() {
  // Desktop devices part
  if(!isMobileDevice) return;

  // Mobile devices part
  targetScrollY -= mouseY-pmouseY;
  scrollSpeed = 0;
}

function mouseWheel(event) {
  if(isMobileDevice) return;
  
  targetScrollY += event.delta;
  scrollSpeed = 0;
}

function mouseReleased() {
  if(!isMobileDevice) {
    canControlScrollBar = false;
    return;
  }

  scrollSpeed = mouseY-pmouseY;
}