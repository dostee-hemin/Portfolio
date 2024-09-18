let experiencesJSON;
let experiences = [];
let topMostY;

function setupExperienceTree() {
    experiences = [];
    
    topMostY = height-socialsJSON.length*60-triangleHeight-230-triangleHeight-experiencesJSON.length*700;
    for(let i=0; i<experiencesJSON.length; i++) {
        let visibility = 0;
        let x = width/2;
        let y = topMostY+i*400+1200;
        if(i != 0) {
            y+=200;
            visibility = (i%2 == 0)?-1:1;
        }
        experiences.push(new Experience(x,y,visibility,experiencesJSON[i]));
    }

    lowestYCoordinate += experiencesJSON.length*700+triangleHeight;
}

function drawExperienceTree() {
    for(let i=0; i<experiences.length; i++) experiences[i].drawBranches();

    // Draw the tree trunk at increasing thicknesses as you go down
    stroke(255);
    for(let y=0;y<experiencesJSON.length*400;y+=10) {
        strokeWeight(map(y,0,experiencesJSON.length*400,7,30));
        line(width/2,topMostY+1200+y,width/2,topMostY+1200+y+20);
    }
}

class Experience {
    constructor(x, y, visibility, info) {
        this.x = x
        this.y = y;
        this.visibility = visibility;
        this.leafPoints = []
        this.branchPoints = []
        this.startingAngle = visibility == 0 ? PI : 0
        this.fractalAngle = this.startingAngle;
        this.targetAngle = PI/8;
        this.isAnimating = false;
        this.branchLength = 100;
        this.info = info
    }

    drawBranches() {
        // If the branches are above the screen, no need to display it
        if(window.scrollY > this.y && this.fractalAngle == this.targetAngle) return;

        // Contains information about where and how to draw the leaves and branches from the recursive generation
        this.leafPoints = []
        this.branchPoints = []
        
        // Animate the branch to grow into view when the user has scrolled to the right point, and animate it to hide once the user leaves
        if (window.scrollY+windowHeight*1.2 >=  this.y) {
            if(!this.isAnimating) {
                p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.targetAngle, 3000, "easeOutQuad")
                .startTween();
            }
            this.isAnimating = true;
        } else {
            if(this.isAnimating) {
                p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.startingAngle, 1500-abs(this.visibility)*500, "easeInOutCubic")
                .startTween();
            }
            this.isAnimating = false;
        }
        
        // If the branch has not grown yet, no need to display it
        if(this.fractalAngle == this.startingAngle) return;

        // Calculate where all the leaves and branches should be
        let rootAngle = this.visibility * this.fractalAngle/this.targetAngle * 0.175;
        this.makeBranch(this.branchLength,rootAngle,0,0);


        push();
        translate(this.x, this.y);
        // Draw the branches
        stroke(255);
        for(let i=0; i<this.branchPoints.length; i++) {
            let branch = this.branchPoints[i];
            strokeWeight(branch[4]);
            line(branch[0], branch[1],branch[2], branch[3]);
        }
        // Draw the leaves
        stroke(0,200,40,100);
        for(let i=0; i<this.leafPoints.length; i++) {
            let leaf = this.leafPoints[i];
            strokeWeight(Math.abs(leaf[0])/40+3);
            point(leaf[0],leaf[1]);
        }
        pop();
    }

    makeBranch(len, branchAngle, x, y){
        // Add leaves only when the length of branch is short enough (i.e. close to the edge of the tree)
        if (len < 30) this.leafPoints.push([x,-y])

        // If the branch length gets too short, leave the function
        if (len < 4) return;
        
        // Skew the tree horizontally so that more horizontal branches are longer
        const adjustedLength = len * (Math.cos(branchAngle)*-3.5+5);

        // Figure out where the end points of this branch are
        const xOffset = Math.sin(branchAngle)*adjustedLength;
        const yOffset = Math.cos(branchAngle)*adjustedLength;
        const x2 = x+xOffset; 
        const y2 = y+yOffset;
    
        // If this branch is not meant to be shown because it's left-only or right-only, leave the function
        if (this.visibility == -1 && x2 > 0) return;
        if (this.visibility == 1 && x2 < 0) return;
    
        // Add branch to the list of branches, including the start and end points and the branch thickness
        this.branchPoints.push([x,-y,x2,-y2,len/this.branchLength * 7]);
        
        // Shorten the length of the branch and draw the one to the left and to the right
        const newLen = len * 0.7;
        this.makeBranch(newLen, branchAngle-this.fractalAngle, x2, y2, this.visibility);
        this.makeBranch(newLen, branchAngle+this.fractalAngle, x2, y2, this.visibility);
    }
}
