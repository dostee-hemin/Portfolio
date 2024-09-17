let experiencesJSON;
let experiences = [];
let fractalAngle = 3.14;
let isAnimating = false;
let branchLength = 100;
let widthFactor = 2;

function setupExperienceTree() {
    experiences = [];

    lowestYCoordinate += experiencesJSON.length*700+triangleHeight;
}

function drawExperienceTree() {
    stroke(255);

    if (window.scrollY >=  height-socialsJSON.length*60-triangleHeight-300-triangleHeight-experiencesJSON.length*700) {
        if(!isAnimating) animator.showFractal();
        isAnimating = true;
    } else {
        if(isAnimating) animator.hideFractal();
        isAnimating = false;
    }
    fractalAngle = animator.fractalAngle;

    push();
    translate(width/2, height-socialsJSON.length*60-triangleHeight-230 - 50-experiencesJSON.length*500);
  
    for(let i=0; i<experiencesJSON.length; i++) {
        let visibility = 0;
        push();
        translate(0,i*400);
        if(i != 0) {
            translate(0,200);
            visibility = (i%2 == 0)?-1:1;
        }
        drawBranch(branchLength, 0, 0, visibility);
        pop();
    }
    
    // Draw the tree trunk at increasing thicknesses as you go down
    stroke(255);
    for(let y=0;y<experiencesJSON.length*500;y+=10) {
        strokeWeight(map(y,0,experiencesJSON.length*500,7,30));
        line(0,y,0,y+20);
    }
    pop();
}

function drawBranch(len, branchAngle, x, visibility){
    if(len < 30) {
        stroke(0,200,40,100);
        strokeWeight(map(Math.abs(x),0,100,3,8));
        point(0,0);
    }
    
    if (len < 4) return;


    const adjustedLength = len * map(Math.cos(branchAngle),-1,1,8,1.5);
    strokeWeight(len/branchLength * 7);
    stroke(255);
    line(0, 0, 0, -adjustedLength);
    translate(0, -adjustedLength);
    
    const leftAngle = -fractalAngle + branchAngle;
    const rightAngle = fractalAngle + branchAngle;
    const leftOffset = Math.sin(leftAngle) * len;
    const rightOffset = Math.sin(rightAngle) * len;

    const newLen = len * 0.7;
    const lenAngleProduct = len * branchAngle;
    
    let canShowLeft = visibility === 0 || 
        (visibility === -1 && x + leftOffset <= 0) ||
        (visibility === 1 && lenAngleProduct > -0.2 && x + leftOffset >= 0);

    let canShowRight = visibility === 0 || 
        (visibility === -1 && lenAngleProduct < 0.2 && x + rightOffset <= 0) ||
        (visibility === 1 && x + rightOffset >= 0);
    
    if(canShowLeft) {
        push();
        rotate(-fractalAngle);
        drawBranch(newLen, leftAngle, x+leftOffset, visibility);
        pop();
    }

    if(canShowRight) {
        push();
        rotate(fractalAngle);
        drawBranch(newLen, rightAngle, x+rightOffset, visibility);
        pop();
    }
}
