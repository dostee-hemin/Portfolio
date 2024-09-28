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
        if(mouseX == pmouseX && mouseY == pmouseY) return false;
        return distSq(this.x,this.y,mouseX, mouseY) < unitSize*40;
    }

    isFinished() {
        return this.lifetime <= 0;
    }

    launch() {
        let directionX = mouseX - mousePos.x;
        let directionY = mouseY - mousePos.y;

        this.targetVel.set(directionX * 0.5,directionY * 0.5).limit(this.maxSpeed);
        this.isOnBranch = false;
    }
}