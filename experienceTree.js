let experiencesJSON;
let experiences = [];
let topMostY;

function setupExperienceTree() {    
    topMostY = lowestYCoordinate-triangleHeight;
    for(let i=0; i<experiencesJSON.length; i++) {
        let visibility = 0;
        let x = widthDiv2;
        let y = topMostY+i*unitSize*45+unitSize*130;
        if(i != 0) {
            y+=unitSize*40;
            visibility = (i%2 == 0)?-1:1;
        }
        if(frameCount == 0) experiences.push(new Experience(x,y,visibility,experiencesJSON[i]));
        else {
           
            experiences[i].setResolutionValues(x,y);
        }
    }

    lowestYCoordinate += experiencesJSON.length*unitSize*45+unitSize*140;
}

function drawExperienceTree() {
    const canvas = document.getElementById("defaultCanvas0");
    const ctx = canvas.getContext("2d");
    let gradient = ctx.createLinearGradient(width,topMostY,0,topMostY+experiencesJSON.length*unitSize*45 + unitSize*120);
    gradient.addColorStop(0, color(40,40,50));
    gradient.addColorStop(0.6, color(15,10,20));
    gradient.addColorStop(1, color(0,5,5));
    ctx.fillStyle = gradient;
    rect(0,topMostY,width,topMostY+experiencesJSON.length*unitSize*45 + unitSize*130);

    textFont(fontBold);
    fill(255);
    noStroke();
    textSize(unitSize*4);
    textAlign(CENTER,CENTER);
    text("Experiences and Education", widthDiv2, topMostY+triangleHeight);


    for(let i=0; i<experiences.length; i++) {
        experiences[i].update();
        experiences[i].drawBranches();
    }

    // Draw the tree trunk at increasing thicknesses as you go down
    stroke(255);
    for(let y=0;y<experiencesJSON.length*unitSize*45;y+=unitSize) {
        strokeWeight(map(y,0,experiencesJSON.length*unitSize*45,unitSize*0.7,unitSize*3));
        line(widthDiv2,topMostY+unitSize*130+y,widthDiv2,topMostY+unitSize*132+y);
    }
}

class Experience {
    constructor(x, y, visibility, info) {
        this.visibility = visibility;
        this.leaves = []
        this.branchPoints = []
        this.startingAngle = visibility == 0 ? PI : 0
        this.fractalAngle = this.startingAngle;
        this.targetAngle = PI/8;
        this.isAnimating = false;
        this.isHovering = false;
        this.info = info
        this.targetAnimationAmount = 0;
        this.animationAmount = this.targetAnimationAmount;
        
        this.isNewLeaves = true;
        this.leafIndex = 0;
        this.tween = p5.tween.manager.addTween(this);
        this.setResolutionValues(x,y);
    }

    setResolutionValues(x,y) {
        this.x = x
        this.y = y;
        this.branchLength = unitSize*10;
        this.createBranchesAndLeaves();
    }

    createBranchesAndLeaves() {
        // Contains information about where and how to draw the leaves and branches from the recursive generation
        this.branchPoints = []

        // Calculate where all the leaves and branches should be
        let rootAngle = this.visibility * this.fractalAngle/this.targetAngle * 0.175;
        this.leafIndex = 0;
        this.makeBranch(this.branchLength,rootAngle,0,0);
        this.isNewLeaves = false;
    }

    drawBranches() {
        // If the tree has not grown yet, we can add new leaves to the list
        if(this.fractalAngle == this.startingAngle) this.isNewLeaves = true

        

        // Update and display all leaves regardless of whether or not we can see the branches
        stroke(0,200,50,100)
        if (this.leaves.length != 0) strokeWeight(this.leaves[0].lifetime * 10);
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

            if(leaf.x < 0 || leaf.x > width || leaf.y < window.scrollY || leaf.y > window.scrollY+windowHeight) continue
            leaf.display();
        }


        // If the branches are above the screen, no need to display it
        if(window.scrollY > this.y && this.fractalAngle == this.targetAngle) return
        

        // Animate the branch to grow into view when the user has scrolled to the right point, and animate it to hide once the user leaves
        if (window.scrollY+windowHeight*0.4 >=  this.y-unitSize*90) {
            if(!this.isAnimating) {
                this.tween.pause();
                this.tween = p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.targetAngle, 2000, "easeOutQuad")
                .startTween();
            }
            this.isAnimating = true;
        } else {
            if(this.isAnimating) {
                this.tween.pause();
                this.tween = p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.startingAngle, 1300-abs(this.visibility)*500, "easeInOutCubic")
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
        if (this.fractalAngle != this.targetAngle) this.createBranchesAndLeaves();

        // Draw all the text information
        let textX = this.visibility * unitSize*5;
        let textAlignment = CENTER;
        if (this.visibility != 0) textAlignment = this.visibility == 1 ? LEFT : RIGHT ; 
        let animationRatio = max(map(this.fractalAngle,this.startingAngle,this.targetAngle,-0.5,1),0);
        translate(0,-unitSize*90);
        // Title
        fill(255, animationRatio*255);
        noStroke();
        textSize((1-this.info['title'].length/30) * unitSize + unitSize*5);
        textFont(fontBold);
        textAlign(textAlignment,CENTER);
        text(this.info['title'], textX, (1-animationRatio)*unitSize*5);
        // Place
        textFont(fontRegular);
        textSize(unitSize*3.5);
        fill(255-this.animationAmount*100,255-this.animationAmount*100,255, max(animationRatio*1.2-0.2,0)*255);
        text(this.info['place'], textX, unitSize*6+((1-max(animationRatio*1.2-0.2,0))*unitSize*5));
        // Duration
        textFont(fontItalic);
        textSize(unitSize*2);
        fill(255, max(animationRatio*1.2-0.2,0)*255);
        let workingTime = this.info['start_date'] + ' - ' + this.info['end_date'];
        text(workingTime, textX, unitSize*11+((1-max(animationRatio*1.2-0.2,0))*unitSize*5));
        
        // Description
        textAlign(textAlignment,TOP);
        textFont(fontRegular);
        textSize(unitSize*2.5);
        fill(255, max(animationRatio*2.5-1.5,0)*255);

        let paragraphedDescription = ""
        let words = this.info['description'].split(" ");
        for(let i=0; i<words.length; i++) {
            if(textWidth(paragraphedDescription + words[i] + " ") > unitSize*80) paragraphedDescription += "\n";
            paragraphedDescription += words[i] + " ";
        }
        text(paragraphedDescription, textX, unitSize*15+((1-max(animationRatio*2.5-1.5,0))*unitSize*5));

        let tagRows = [[]];
        let tagX = 0;
        translate(0,(1-max(animationRatio*3-2,0))*unitSize*5);
        textSize(unitSize*1.8);
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        for(let i=0; i<this.info['tags'].length; i++) {
            let tag = this.info['tags'][i];

            if(tagX+textWidth(tag) > width*0.4) {
                tagX = 0;
                tagRows.push([]);
            }

            tagRows[tagRows.length-1].push(tag)
            tagX += textWidth(tag) + unitSize*4;
        }
        let tagY = unitSize*27;
        for(let row=0; row<tagRows.length; row++) {
            let totalWidth = 0;
            for (let i=0; i<tagRows[row].length; i++) {
                if(i!=0) totalWidth += unitSize*4
                totalWidth += textWidth(tagRows[row][i]);
            }
            let tagX = -totalWidth/2;
            if (this.visibility == 1) tagX = unitSize*6;
            else if (this.visibility == -1) tagX = -totalWidth-unitSize*6;
            for(let i=0; i<tagRows[row].length; i++) {
                let tag = tagRows[row][i];

                stroke(this.info["color_red"],this.info["color_green"],this.info["color_blue"],map(animationRatio,0.7,1,0,255));
                strokeWeight(unitSize*2.8);
                line(tagX,tagY,tagX+textWidth(tag),tagY);
                
                noStroke();
                fill(255,map(animationRatio,0.7,1,0,255));
                text(tag,tagX,tagY-2);
    
                tagX += textWidth(tag) + unitSize*4;
            }

            tagY += unitSize*4;
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

    endAnimation() {
        if (window.scrollY+windowHeight*0.4 >=  this.y-unitSize*90) {
            if(!this.isAnimating) {
                this.tween.pause();
                this.tween = p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.targetAngle, 1000, "easeInOutCubic")
                .startTween();
            }
            this.isAnimating = true;
        } else {
            if(this.isAnimating) {
                this.tween.pause();
                this.tween = p5.tween.manager.addTween(this)
                .addMotion('fractalAngle', this.startingAngle, 1000, "easeInOutCubic")
                .startTween();
            }
            this.isAnimating = false;
        }
    }

    isUnderMouse() {
        if(this.fractalAngle == this.startingAngle) return false;

        textFont(fontRegular);
        textSize(unitSize*3.5);
        let placeTextWidth = textWidth(this.info['place'])
        let minX = this.x-placeTextWidth/2;
        let maxX = this.x+placeTextWidth/2;
        if(this.visibility == 1) {
            minX = this.x+unitSize*5;
            maxX = minX + placeTextWidth;
        } else if (this.visibility == -1) {
            maxX = this.x-unitSize*5;
            minX = maxX - placeTextWidth;
        }
        return mousePos.x > minX && mousePos.x < maxX && mousePos.y > this.y-unitSize*87 && mousePos.y < this.y-unitSize*81;
    }

    makeBranch(len, branchAngle, x, y){
        // Add leaves only when the length of branch is short enough (i.e. close to the edge of the tree)
        if (len < unitSize*3) {
            if(this.isNewLeaves) this.leaves.unshift(new Leaf(x+this.x, -y+this.y))
            else {
                this.leaves[this.leafIndex].setPositionAndThickness(x+this.x, -y+this.y)
                this.leafIndex += 1
            }
        }

        // If the branch length gets too short, leave the function
        if (len < unitSize) return;
        
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
        this.branchPoints.push([x,-y,x2,-y2,len/this.branchLength * unitSize*0.7]);
        
        // Shorten the length of the branch and draw the one to the left and to the right
        const newLen = len * 0.7;
        this.makeBranch(newLen, branchAngle-this.fractalAngle, x2, y2);
        this.makeBranch(newLen, branchAngle+this.fractalAngle, x2, y2);
    }
}