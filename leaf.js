class Leaf {
    constructor(x, y, thickness){
        this.location = new p5.Vector(x, y);
        this.velocity = new p5.Vector();
        this.acceleration = new p5.Vector();

        this.thickness = thickness;

        this.isOnBranch = true;
        this.drag = 0.978;

        this.gravity = new p5.Vector(0,0.2);
        this.targetVelocity = new p5.Vector();
        this.alpha = 150;
        this.leafColor = {"red":random(20),"green":random(120,160),"blue":random(30,70)};
        this.isFading = false;
    }

    setPositionAndThickness(x,y,thickness) {
        if(!this.isOnBranch) return;

        this.location.set(x,y);
        this.thickness = thickness;
    }

    display() {
        if(this.location.x < 0 || this.location.x > width || this.location.y < window.scrollY || this.location.y > window.scrollY+windowHeight) return
        stroke(this.leafColor.red,this.leafColor.green,this.leafColor.blue,this.alpha);
        strokeWeight(this.thickness);
        point(this.location.x, this.location.y);
    }

    update() {
        if(this.isOnBranch) return;

        if(this.isFading) this.alpha -= 5;

        this.acceleration.add(this.gravity);
        this.targetVelocity.add(this.acceleration);
        this.targetVelocity.mult(this.drag);
        let amnt = this.velocity.mag()
        if(random(1) < amnt/100) {
            this.targetVelocity.rotate(random(-amnt/5,amnt/5));
        }
        this.velocity = p5.Vector.lerp(this.velocity,this.targetVelocity,0.03);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    isUnderMouse() {
        if(mouseX == pmouseX && mouseY == pmouseY) return false;
        return distSq(this.location.x,this.location.y,mouseX, mouseY) < 400;
    }

    isFinished() {
        return this.alpha <= 0;
    }

    launch() {
        let mouseVector = new p5.Vector(mouseX,mouseY);
        let prevMouseVector = new p5.Vector(mousePos.x,mousePos.y);
        let direction = p5.Vector.sub(mouseVector, prevMouseVector);

        this.acceleration = direction.mult(0.5);
        this.acceleration.limit(30);
        this.velocity = p5.Vector.mult(this.acceleration,0.7);
        this.isOnBranch = false;
    }
}