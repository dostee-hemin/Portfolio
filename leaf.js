class Leaf {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.targetVel = new p5.Vector();
        this.accX = 0;
        this.accY = 0;
        this.gravityY = 0.2;
        this.thickness=0;

        this.isOnBranch = true;
        this.drag = 0.978;
    }

    setPositionAndThickness(x,y) {
        if(!this.isOnBranch) return;

        this.x = x;
        this.y = y;
        this.thickness = map(Math.abs(x-width/2),0,width/2,0,1)*8 + 10;
    }

    display() {
        if(this.x < 0 || this.x > width || this.y < window.scrollY || this.y > window.scrollY+windowHeight) return
        stroke(10,140,50,100);
        strokeWeight(this.thickness);
        point(this.x, this.y);
    }

    update() {
        if(this.isOnBranch) return;

        if(this.isFading) this.alpha -= 5;

        this.accY += this.gravityY;
        this.targetVel.x = constrain(this.targetVel.x+this.accX * this.drag,-15,15);
        this.targetVel.y = constrain(this.targetVel.y+this.accY * this.drag,-15,15);

        let amnt = this.targetVel.magSq()
        if(random(1) < amnt/5000) {
            this.targetVel.rotate(random(-amnt/400,amnt/400))
        }
        this.velX = lerp(this.velX,this.targetVel.x,0.03);
        this.velY = lerp(this.velY,this.targetVel.y,0.03);
        this.x += this.velX;
        this.y += this.velY;
        this.accX = 0;
        this.accY = 0;
    }

    isUnderMouse() {
        if(mouseX == pmouseX && mouseY == pmouseY) return false;
        return distSq(this.x,this.y,mouseX, mouseY) < 400;
    }

    isFinished() {
        return this.alpha <= 0;
    }

    launch() {
        let directionX = mouseX - mousePos.x;
        let directionY = mouseY - mousePos.y;

        
        this.accX = constrain(directionX * 0.5,-15,15);
        this.accY = constrain(directionY * 0.5,-15,15);
        this.velX = this.accX * 0.7;
        this.velY = this.accY * 0.7;
        this.isOnBranch = false;
    }
}