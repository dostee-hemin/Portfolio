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
    }

    display() {
        stroke(0,200,40,100);
        strokeWeight(this.thickness);
        point(this.location.x, this.location.y);
    }

    update() {
        if(this.isOnBranch) return

        this.acceleration.add(this.gravity);
        this.targetVelocity.add(this.acceleration);
        this.targetVelocity.mult(this.drag);
        if(random(1) < this.velocity.mag()/100) this.targetVelocity.rotate(random(-1,1));
        this.velocity = p5.Vector.lerp(this.velocity,this.targetVelocity,0.03);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    isUnderMouse() {
        return distSq(this.location.x,this.location.y,mouseX, mouseY) < 400;
    }

    isFinished() {
        return this.location.y > height;
    }

    launch() {
        let mouseVector = new p5.Vector(mouseX,mouseY);
        let prevMouseVector = new p5.Vector(prevMousePos.x,prevMousePos.y);
        let direction = p5.Vector.sub(mouseVector, prevMouseVector);

        this.acceleration = direction.mult(0.5);
        this.velocity = p5.Vector.mult(this.acceleration,0.7);
        this.isOnBranch = false;
    }
}