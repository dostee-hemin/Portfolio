class BackgroundPiece {
    constructor() {
        this.angle;
        this.distanceFromCenter;
        this.location = new p5.Vector();

        // Choose a random Tetris piece and give it a random rotation
        this.pieceType = int(random(7));
        this.targetRotation = int(random(4)) * HALF_PI;
        this.rotation = this.targetRotation

        // The target size the piece wants to be and the current size the piece is (used for making smooth growing animations)
        this.targetScale = 1;
        this.currentScale = 0;
        this.twistScale = 0;
        
        // Pick a standard color for all pieces and assign it to the current stroke color
        this.baseColor = color(18, 74, 161);
        this.strokeColor = this.baseColor;
    }

    // Sets the values related to how the piece is shown in the pattern,
    // such as the position, rotation, and distance from the center of the screen
    setPatternPosition(x,y,angle,distanceFromCenter) {
        this.location.set(x,y);
        this.angle = angle;
        this.distanceFromCenter = distanceFromCenter;
    }

    display() {
        // Translate and rotate to the appropriate location
        let interactionScale = 0;
        let closeness = 0
        this.strokeColor = this.baseColor;
        strokeWeight(1);

        // Calculate the closeness based on either the distance to the ripple (mobile) or distance to mouse (desktop)
        if (isMobileDevice) closeness = this.twistScale*2
        else if(mousePos.x != 0 || mousePos.y-scrollY/2 != 0) closeness = this.getClosenessProportion();
        
        // Show the true color of the piece based on the closeness value
        if (closeness > 0) {
            let assignedColor = colors[this.pieceType];
            let colorDifferences = [
                red(assignedColor)-red(this.baseColor),
                green(assignedColor)-green(this.baseColor),
                blue(assignedColor)-blue(this.baseColor)
            ];
            let fadedColor = color(
                red(this.baseColor)+colorDifferences[0]*closeness,
                green(this.baseColor)+colorDifferences[1]*closeness,
                blue(this.baseColor)+colorDifferences[2]*closeness,
            );
            this.strokeColor = fadedColor;
            strokeWeight(1+closeness);
            interactionScale = closeness/4;
        }

        // Display the piece according to which type it is
        noFill();
        stroke(this.strokeColor);
        beginShape();
        let currentVerticies = pieceVertices[this.pieceType];
        for(let vertexIndex = 0; vertexIndex < currentVerticies.length; vertexIndex ++) {
            let dir = new p5.Vector(currentVerticies[vertexIndex][0],currentVerticies[vertexIndex][1])
            dir.rotate(this.angle + this.rotation)
            dir.mult(this.currentScale + this.twistScale + interactionScale)
            let x = this.location.x + dir.x * pieceBaseLength;
            let y = this.location.y + dir.y * pieceBaseLength;
            vertex(x,y);
        }
        endShape(CLOSE);
    }

    // Update the display values over time
    update() {
        this.rotation = lerp(this.rotation, this.targetRotation, 0.1);

        this.targetScale = map(this.distanceFromCenter,0,max(width,height)/2,0,0.5)+0.5;
        this.currentScale = lerp(this.currentScale, this.targetScale, 0.04);
    }

    // Returns a floating point value that represents how close the piece is to the mouse
    // (1 = right under the mouse, 0 = on the edge of the highlight zone, <0 = too far from mouse)
    getClosenessProportion() {
        // If the piece is too far away to be considered, leave the function
        if(max(abs(this.location.x-mousePos.x),abs(this.location.y-mousePos.y+scrollY/2)) > highlightRadius) return -1;

        let distanceToMouse = this.getDistanceSquared(mousePos.x,mousePos.y-scrollY/2,this.location.x,this.location.y);
        return 1-distanceToMouse/(highlightRadius*highlightRadius);
    }

    // Returns the distance between two points squared
    // (faster than dist() function because you don't use the square root operation)
    getDistanceSquared(x1,y1, x2,y2) {
        return (x2 - x1) ** 2 + (y2 - y1) ** 2;
    }

    // Function to play a twisting animation whenver this piece gets affected by a ripple object
    twist() {
        // Start an animation that increases the scale and rotates the peice then goes back to the original scale
        p5.tween.manager.addTween(this)
            .addMotions([
                { key: 'targetRotation', target: this.targetRotation + (round(random(1))*2-1) * HALF_PI},
                { key: 'twistScale', target: 0.5}
            ], 100, "easeOutSin")
            .addMotion('twistScale', 0, 100, "easeInSin")
            .startTween();
    }
}