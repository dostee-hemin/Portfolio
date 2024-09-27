let experiencesJSON;
let experiences = [];
let topMostY;

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
        this.leafPoints = []
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
