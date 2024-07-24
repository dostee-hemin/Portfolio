// These values you can play around with to adjust how the background pattern is displayed
let numberOfBackgroundPieces = 1300;    // How many Tetris pieces we want to display in the pattern
let highlightRadius = 300;              // The distance (in pixels) a piece has to be from the mouse before it can be highlighted
let pieceBaseLength = 10;               // The side length (in pixels) of a piece's individual squares to determine the size of the whole piece
let targetPatternRadius = 32.1;         // The target scale we want to reach for the pattern
let targetDeltaAngle = 137.5;           // The target angle difference we want to reach for the pattern

let backgroundPieces = [];              // The list containing all Tetris pieces of the pattern
let ripples = []                        // The list containing all ripple animation objects
let patternRadius = 0;                  // A variable that acts as a scaling factor
let deltaAngle = 137;                   // The angle difference between each successive piece in the pattern
let colors = [];                        // The list of colors corresponding to each piece type
let pieceVertices = [                   // The vertex coordinates of each of the piece shapes (used to render the pieces)
    [[-1,1], [1,1], [1,-1], [-1,-1]],           // O
    [[-0.5,2], [0.5,2], [0.5,-2], [-0.5,-2]],   // I
    [[0.5,-1.5], [0.5,1.5], [-0.5,1.5], [-0.5,0.5], [-1.5,0.5], [-1.5,-0.5], [-0.5,-0.5], [-0.5,-1.5]],     // T
    [[-1,1.5], [0,1.5], [0,0.5], [1,0.5], [1,-1.5], [0,-1.5], [0,-0.5], [-1,-0.5]],     // Z
    [[-1,-1.5], [0,-1.5], [0,-0.5], [1,-0.5], [1,1.5], [0,1.5], [0,0.5], [-1,0.5]],     // S
    [[-1,-1.5], [-1,0.5], [2,0.5], [2,-0.5], [0,-0.5], [0,-1.5]],       // J
    [[-1,1.5], [-1,-0.5], [2,-0.5], [2,0.5], [0,0.5], [0,1.5]]          // L
]


// Function to start everything required for the Tetris pattern
function setupTetrisPattern() {
    // Create a bunch of new background pieces
    for(let i=0; i<numberOfBackgroundPieces; i++) {
        backgroundPieces.push(new BackgroundPiece());
    }
    
    // Assign the piece colors here
    colors.push(color(255,255,0));  // O
    colors.push(color(0,255,255));  // I
    colors.push(color(255,0,255));  // T
    colors.push(color(0,255,0));    // Z
    colors.push(color(255,0,0));    // S
    colors.push(color(255,100,0));  // J
    colors.push(color(0,0,255));    // L
}

// Function to display the Tetris pattern and animate it
function drawTetrisPattern() {
    // Grow and rotate the pattern into the desired position
    patternRadius = animator.targetRadiusAnim
    deltaAngle = animator.targetDeltaAngleAnim
    
    // Loop through all the ripples and update them
    for(let i=ripples.length-1; i>=0; i--) {
        let ripple = ripples[i];
        
        // Grow the ripple and twist any new pieces it surrounds
        ripple.update();
        for(let j=0; j<numberOfBackgroundPieces; j++) {
            let piece = backgroundPieces[j];
            if(ripple.surrounds(piece.location)) piece.twist();
        }

        // Once the ripple is too big, remove it from the list
        if(ripple.isFinished()) ripples.splice(i,1);
    }
    // Loop through all background pieces to update and display them
    for(let i=0; i<numberOfBackgroundPieces; i++) {
      let distanceFromCenter = patternRadius * sqrt(i);       //Calculate the radius using the equation
      let currentAngle = i * radians(deltaAngle);             //Calculate the angle using the equation

      // Don't show any pieces that would be under the profile image
      if (distanceFromCenter < animator.profileImageSize/2 && animator.profileImageOffset < 40) continue;
      
      // Calculate the "x" and "y" poition using Polar to Carteasian transformations
      let x = distanceFromCenter * cos(currentAngle) + width/2;
      let y = distanceFromCenter * sin(currentAngle) + height/2;

  
      // Assign the values of the current piece and display it to the screen
      backgroundPieces[i].setPatternPosition(x,y,currentAngle,distanceFromCenter);
      backgroundPieces[i].update();
      backgroundPieces[i].display();
    }
}

// Function called once every time the mouse is pressed
function mousePressed() {
    // Start a new ripple animation at the cursor's current location
    ripples.push(new Ripple(mouseX,mouseY));
}