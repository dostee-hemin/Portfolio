class Ripple {
    constructor(x, y) {
        this.location = createVector(x,y);
        this.radius = 0;
        this.growSpeed = unitSize*5;
    }

    // Function called to increase the size of the ripple
    update() {
        this.radius += this.growSpeed;
    }

    // Returns whether or not the ripple has grown big enough to surround the given location
    surrounds(otherLocation) {
        let distSq = p5.Vector.sub(this.location,otherLocation).magSq()
        return distSq < (this.radius)**2  && distSq > (this.radius-this.growSpeed)**2 ;
    }

    // Returns whether or not the ripple has grown too big to be relevant on screen anymore
    isFinished() {
        return this.radius > width+height;
    }
}