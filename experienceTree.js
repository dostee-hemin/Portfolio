let experiencesJSON;
let experiences = [];
let topMostY;
let noiseTime = 0;

function setupExperienceTree() {
    experiences = [];
    
    topMostY = lowestYCoordinate-triangleHeight;
    for(let i=0; i<experiencesJSON.length; i++) {
        let visibility = 0;
        let x = width/2;
        let y = topMostY+i*450+1200;
        if(i != 0) {
            y+=400;
            visibility = (i%2 == 0)?-1:1;
        }
        experiences.push(new Experience(x,y,visibility,experiencesJSON[i]));
    }

    lowestYCoordinate += experiencesJSON.length*450+1400;
}

function drawExperienceTree() {
    const canvas = document.getElementById("defaultCanvas0");
    const ctx = canvas.getContext("2d");
    let gradient = ctx.createLinearGradient(0,topMostY,width,topMostY+experiencesJSON.length*450+1200);
    gradient.addColorStop(0, color(50));
    gradient.addColorStop(1, color(0,5,5));
    ctx.fillStyle = gradient;
    rect(0,topMostY,width,topMostY+experiencesJSON.length*450+1200);

    textFont(fontBold);
    fill(255);
    noStroke();
    textSize(40);
    textAlign(CENTER,CENTER);
    text("Experiences", width/2, topMostY+triangleHeight);


    for(let i=0; i<experiences.length; i++) {
        experiences[i].update();
        experiences[i].drawBranches();
    }

    // Draw the tree trunk at increasing thicknesses as you go down
    stroke(255);
    for(let y=0;y<experiencesJSON.length*450;y+=10) {
        strokeWeight(map(y,0,experiencesJSON.length*450,7,30));
        line(width/2,topMostY+1200+y,width/2,topMostY+1200+y+20);
    }
}

class Experience {
    constructor(x, y, visibility, info) {
        this.x = x
        this.y = y;
        this.visibility = visibility;
        this.leaves = []
        this.branchPoints = []
        this.startingAngle = visibility == 0 ? PI : 0
        this.fractalAngle = this.startingAngle;
        this.targetAngle = PI/8;
        this.isAnimating = false;
        this.isHovering = false;
        this.branchLength = 100;
        this.info = info
        this.targetAnimationAmount = 0;
        this.animationAmount = this.targetAnimationAmount;

        this.isNewLeaves = true;
        this.leafIndex = 0;
    }

    drawBranches() {
        // If the tree has not grown yet, we can add new leaves to the list
        if(this.fractalAngle == this.startingAngle) this.isNewLeaves = true

        // Update and display all leaves regardless of whether or not we can see the branches
        stroke(0,200,50,100)
        strokeWeight(10);
        for(let i=this.leaves.length-1; i>=0; i--) {
            let leaf = this.leaves[i];

            // If the leaf has faded away, remove it from the list
            if(leaf.isFinished()) this.leaves.splice(i,1);
            
            // If the branches have close again, remove all stationary leaves and make all moving leaves fade away
            if(this.isNewLeaves) {
                if(leaf.isOnBranch) this.leaves.splice(i,1)
                else leaf.isFading = true;
            }

            // Update the leaf's physics and fading
            leaf.update();

            // Don't show the leaf if it's off the screen
            if(leaf.y > height) continue

            // If a stationary leaf gets brushed by the mouse, apply the wind force and launch it
            if(leaf.isUnderMouse() && leaf.isOnBranch) leaf.launch()
            // leaf.display();
            if(leaf.x < 0 || leaf.x > width || leaf.y < window.scrollY || leaf.y > window.scrollY+windowHeight) continue
            point(leaf.x,leaf.y);
        }


        // If the branches are above the screen, no need to display it
        if(window.scrollY > this.y && this.fractalAngle == this.targetAngle) return
        

        // Animate the branch to grow into view when the user has scrolled to the right point, and animate it to hide once the user leaves
        if (window.scrollY+windowHeight*0.4 >=  this.y-900) {
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
        

        push();
        translate(this.x, this.y);
        // Draw the branches
        stroke(255);
        for(let i=0; i<this.branchPoints.length; i++) {
            let branch = this.branchPoints[i];
            strokeWeight(branch[4]);
            line(branch[0], branch[1],branch[2], branch[3]);
        }

        // Only calculate the position and details of the branches and leaves when the tree is being animated
        if (this.fractalAngle != this.targetAngle) {
            // Contains information about where and how to draw the leaves and branches from the recursive generation
            this.branchPoints = []

            // Calculate where all the leaves and branches should be
            let rootAngle = this.visibility * this.fractalAngle/this.targetAngle * 0.175;
            this.leafIndex = 0;
            this.makeBranch(this.branchLength,rootAngle,0,0);
            this.isNewLeaves = false;
        }

        // Draw all the text information
        let textX = this.visibility * 50;
        let textAlignment = CENTER;
        if (this.visibility != 0) textAlignment = this.visibility == 1 ? LEFT : RIGHT ; 
        let animationRatio = max(map(this.fractalAngle,this.startingAngle,this.targetAngle,-0.5,1),0);
        translate(0,-900);
        // Title
        fill(255, animationRatio*255);
        noStroke();
        textSize(60);
        textFont(fontBold);
        textAlign(textAlignment,CENTER);
        text(this.info['title'], textX, (1-animationRatio)*50);
        // Place
        textFont(fontRegular);
        textSize(35);
        fill(255-this.animationAmount*100,255-this.animationAmount*100,255, max(animationRatio*1.2-0.2,0)*255);
        text(this.info['place'], textX, 60+((1-max(animationRatio*1.2-0.2,0))*50));
        // Duration
        textFont(fontItalic);
        textSize(20);
        fill(255, max(animationRatio*1.2-0.2,0)*255);
        let workingTime = this.info['start_date'] + ' - ' + this.info['end_date'];
        text(workingTime, textX, 110+((1-max(animationRatio*1.2-0.2,0))*50));
        
        // Description
        textAlign(textAlignment,TOP);
        textFont(fontRegular);
        textSize(25);
        fill(255, max(animationRatio*2.5-1.5,0)*255);

        let paragraphedDescription = ""
        let words = this.info['description'].split(" ");
        for(let i=0; i<words.length; i++) {
            if(textWidth(paragraphedDescription + words[i] + " ") > 800) paragraphedDescription += "\n";
            paragraphedDescription += words[i] + " ";
        }
        text(paragraphedDescription, textX, 150+((1-max(animationRatio*2.5-1.5,0))*50));

        let tagRows = [[]];
        let tagX = 0;
        translate(0,(1-max(animationRatio*3-2,0))*50);
        textSize(18);
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        for(let i=0; i<this.info['tags'].length; i++) {
            let tag = this.info['tags'][i];

            if(tagX+textWidth(tag) > width*0.4) {
                tagX = 0;
                tagRows.push([]);
            }

            tagRows[tagRows.length-1].push(tag)
            tagX += textWidth(tag) + 40;
        }
        let tagY = 270;
        for(let row=0; row<tagRows.length; row++) {
            let totalWidth = 0;
            for (let i=0; i<tagRows[row].length; i++) {
                if(i!=0) totalWidth += 40
                totalWidth += textWidth(tagRows[row][i]);
            }
            let tagX = -totalWidth/2;
            if (this.visibility == 1) tagX = 60;
            else if (this.visibility == -1) tagX = -totalWidth-60;
            for(let i=0; i<tagRows[row].length; i++) {
                let tag = tagRows[row][i];

                stroke(this.info["color_red"],this.info["color_green"],this.info["color_blue"],map(animationRatio,0.7,1,0,255));
                strokeWeight(28);
                line(tagX,tagY,tagX+textWidth(tag),tagY);
                
                noStroke();
                fill(255,map(animationRatio,0.7,1,0,255));
                text(tag,tagX,tagY-2);
    
                tagX += textWidth(tag) + 40;
            }

            tagY += 40;
        }
        pop();
    }

    update() {
        this.animationAmount = lerp(this.animationAmount, this.targetAnimationAmount, 0.3);
        if(this.isUnderMouse()) {
            if(!this.isHovering) {
                this.targetAnimationAmount = 1;
                cursor('pointer');
            }
            this.isHovering = true;
        } else {
            if(this.isHovering) {
                this.targetAnimationAmount = 0;
                cursor(ARROW);
            }
            this.isHovering = false;
        }
    }

    isUnderMouse() {
        if(this.fractalAngle == this.startingAngle) return false;

        textFont(fontRegular);
        textSize(35);
        let placeTextWidth = textWidth(this.info['place'])
        let minX = this.x-placeTextWidth/2;
        let maxX = this.x+placeTextWidth/2;
        if(this.visibility == 1) {
            minX = this.x+50;
            maxX = minX + placeTextWidth;
        } else if (this.visibility == -1) {
            maxX = this.x+-50;
            minX = maxX - placeTextWidth;
        }
        return mousePos.x > minX && mousePos.x < maxX && mousePos.y > this.y-870 && mousePos.y < this.y-810;
    }

    makeBranch(len, branchAngle, x, y){
        // Add leaves only when the length of branch is short enough (i.e. close to the edge of the tree)
        if (len < 10) {
            if(this.isNewLeaves) this.leaves.push(new Leaf(x+this.x, -y+this.y))
            else {
                this.leaves[this.leafIndex].setPositionAndThickness(x+this.x, -y+this.y)
                this.leafIndex += 1
            }
        }

        // If the branch length gets too short, leave the function
        if (len < 8) return;
        
        // Skew the tree horizontally so that more horizontal branches are longer
        const adjustedLength = len * (Math.cos(branchAngle)*-3.5+5);

        // Figure out where the end points of this branch are
        const xOffset = Math.sin(branchAngle)*adjustedLength;
        const yOffset = Math.cos(branchAngle)*adjustedLength;
        let x2 = x+xOffset; 
        let y2 = y+yOffset;
    
        // If this branch is not meant to be shown because it's left-only or right-only, leave the function
        if (this.visibility == -1 && x2 > 0) x2 = 0;
        if (this.visibility == 1 && x2 < 0) x2 = 0;
    
        // Add branch to the list of branches, including the start and end points and the branch thickness
        this.branchPoints.push([x,-y,x2,-y2,len/this.branchLength * 7]);
        
        // Shorten the length of the branch and draw the one to the left and to the right
        const newLen = len * 0.7;
        this.makeBranch(newLen, branchAngle-this.fractalAngle, x2, y2);
        this.makeBranch(newLen, branchAngle+this.fractalAngle, x2, y2);
    }
}