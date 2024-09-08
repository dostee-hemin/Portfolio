class BackgroundPiece {
    constructor() {
        this.angle;
        this.distanceFromCenter;
        this.location = createVector();

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
        push();
        translate(this.location.x,this.location.y);
        scale(this.currentScale + this.twistScale);
        rotate(this.angle + this.rotation);
        
        this.strokeColor = this.baseColor;
        strokeWeight(1);
        // Based on the distance to the mouse (value from 0-1), highlight the piece with size and color
        if(mousePos.x != 0 || mousePos.y != 0) {
            let closeness = this.getClosenessProportion();
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
                scale(1+closeness/3);
            }
        }

        // Display the piece according to which type it is
        noFill();
        stroke(this.strokeColor);
        beginShape();
        let currentVerticies = pieceVertices[this.pieceType];
        for(let vertexIndex = 0; vertexIndex < currentVerticies.length; vertexIndex ++) {
            let x = currentVerticies[vertexIndex][0] * pieceBaseLength;
            let y = currentVerticies[vertexIndex][1] * pieceBaseLength;
            vertex(x,y);
        }
        endShape(CLOSE);
        pop();
    }

    // Update the display values over time
    update() {
        this.targetScale = map(this.distanceFromCenter,0,max(width,height)/2,0,0.5)+0.5;
        this.currentScale = lerp(this.currentScale, this.targetScale, 0.04);

        this.rotation = lerp(this.rotation, this.targetRotation, 0.1);
    }

    // Returns a floating point value that represents how close the piece is to the mouse
    // (1 = right under the mouse, 0 = on the edge of the highlight zone, <0 = too far from mouse)
    getClosenessProportion() {
        // If the piece is too far away to be considered, leave the function
        if(max(abs(this.location.x-mousePos.x),abs(this.location.y-mousePos.y)) > highlightRadius) return -1;

        let distanceToMouse = this.getDistanceSquared(mousePos.x,mousePos.y,this.location.x,this.location.y);
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