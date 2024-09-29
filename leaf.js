class Leaf {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.targetVel = new p5.Vector();
        this.accX = 0;
        this.accY = 0;
        this.gravityY = unitSize*0.03;
        this.thickness = 0;
        this.maxSpeed = unitSize*1.5;

        this.lifetime = 1;
        this.isFading = false;

        this.isOnBranch = true;
        this.drag = 0.978;
    }

    setPositionAndThickness(x,y) {
        if(!this.isOnBranch) return;

        this.x = x;
        this.y = y;
        this.thickness = map(Math.abs(x-widthDiv2),0,widthDiv2,0,1)*unitSize*2 + unitSize;
    }

    display() {
        if(this.x < 0 || this.x > width || this.y < window.scrollY || this.y > window.scrollY+windowHeight) return
        stroke(10,140,50,this.lifetime*200);
        strokeWeight(this.thickness);
        point(this.x, this.y);
    }

    update() {
        if(this.isOnBranch) return;

        if(this.isFading) this.lifetime -= 0.01;

        this.accY += this.gravityY;
        this.targetVel.x = constrain(this.targetVel.x+this.accX * this.drag,-this.maxSpeed,this.maxSpeed);
        this.targetVel.y = constrain(this.targetVel.y+this.accY * this.drag,-this.maxSpeed,this.maxSpeed);

        let amnt = this.targetVel.magSq()
        if(random(1) < amnt/(this.maxSpeed*this.maxSpeed*5.88)) this.targetVel.rotate(random(-amnt/(this.maxSpeed*30),amnt/(this.maxSpeed*30)))
        this.velX = lerp(this.velX,this.targetVel.x,0.09);
        this.velY = lerp(this.velY,this.targetVel.y,0.09);
        this.x += this.velX;
        this.y += this.velY;
        this.accX = 0;
        this.accY = 0;
    }

    isUnderMouse() {
        if(mousePos.x == prevMousePos.x) return false;
        // Calculate the components of the line vector
        let dx = mousePos.x - prevMousePos.x;
        let dy = mousePos.y - prevMousePos.y;

        // Calculate the components of the vector from the line start to the point
        let px = this.x - prevMousePos.x;
        let py = this.y - prevMousePos.y;

        // Calculate the dot product of the two vectors
        let dot = px * dx + py * dy;

        // Calculate the length squared of the line vector
        let lenSq = dx * dx + dy * dy;

        // Calculate the projection factor
        let param = dot / lenSq;

        // Find the closest point on the line segment
        let closestX, closestY;
        if (param < 0) {
            closestX = prevMousePos.x;
            closestY = prevMousePos.y;
        } else if (param > 1) {
            closestX = mousePos.x;
            closestY = mousePos.y;
        } else {
            closestX = prevMousePos.x + param * dx;
            closestY = prevMousePos.y + param * dy;
        }

        // Calculate the squared distance from the point to the closest point on the line
        return distSq(this.x,this.y,closestX, closestY) < unitSize*40;
    }

    isFinished() {
        return this.lifetime <= 0;
    }

    launch() {
        let directionX = mousePos.x - prevMousePos.x;
        let directionY = mousePos.y - prevMousePos.y;

        this.targetVel.set(directionX * 0.5,directionY * 0.5).limit(this.maxSpeed);
        this.isOnBranch = false;
    }
}