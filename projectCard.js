class ProjectCard {
    constructor(x, y, project_info) {
        this.x = x;
        this.y = y;
        this.img = project_info.image;
        this.name = project_info.name;
        this.description = project_info.description;
        this.tools = project_info.tools;
        this.link = project_info.link;
        
        this.hoverAmnt = 0;
        this.targetHoverAmnt = 0;
        this.isHovering = false;
    }

    display() {
        push()
        translate(this.x, this.y - this.hoverAmnt * 20);
        imageMode(CENTER);
        noTint();
        image(this.img, 0, 0, cardSize, cardSize);
        
        // Black gradient
        const canvas = document.getElementById("defaultCanvas0");
        const ctx = canvas.getContext("2d");
        let gradient = ctx.createLinearGradient(0,cardSize*(0.2-this.hoverAmnt*0.7),0,cardSize*(0.5001 - this.hoverAmnt));
        gradient.addColorStop(0, color(0, 0));
        gradient.addColorStop(1, color(0, 230));
        ctx.fillStyle = gradient;
        noStroke();
        rectMode(CORNER);
        rect(-cardSize/2,cardSize*(0.2-this.hoverAmnt*0.7),cardSize,cardSize*(0.3+ this.hoverAmnt*0.7)+0.5);

        // Name
        fill(255);
        textSize(map(this.name.length,1,20,32,22));
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        text(this.name, cardSize*-0.4, cardSize*(0.37 - this.hoverAmnt*0.7));

        // Description
        fill(220, map(this.hoverAmnt,0.7,1,0,255));
        textSize(18);
        textAlign(LEFT,TOP);
        textFont(fontRegular);
        let fittedText = "";
        let words = this.description.split(" ");
        for(let i=0; i<words.length; i++) {
            if(textWidth(fittedText + words[i]) > cardSize*0.8) fittedText += "\n";
            fittedText += words[i] + " ";
        }
        text(fittedText, cardSize*-0.4, cardSize*-0.25);

        let toolX = cardSize*-0.4+10;
        let toolY = cardSize*0.3;
        textSize(14);
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        for(let i=0; i<this.tools.length; i++) {
            let tool = this.tools[i];

            if(toolX+textWidth(tool) > cardSize*0.4) {
                toolX = cardSize*-0.4+10;
                toolY += textAscent(tool)*2;
            }

            stroke(130,map(this.hoverAmnt,0.7,1,0,255));
            strokeWeight(20);
            line(toolX,toolY,toolX+textWidth(tool),toolY);
            
            noStroke();
            fill(255,map(this.hoverAmnt,0.7,1,0,255));
            text(tool,toolX,toolY-2);


            toolX += textWidth(tool) + 30;
        }
        pop();
    }

    update() {
        this.hoverAmnt = lerp(this.hoverAmnt, this.targetHoverAmnt, 0.1);

        if(this.isUnderMouse()) {
            if(!this.isHovering) {
                this.targetHoverAmnt = 1;
                cursor('pointer');
            }
            this.isHovering = true;
        } else {
            if(this.isHovering) {
                this.targetHoverAmnt = 0;
                cursor(ARROW);
            }
            this.isHovering = false;
        }
    }

    isUnderMouse() {
        return mouseX > this.x-cardSize/2 && mouseX < this.x+cardSize/2 && mouseY > this.y-cardSize/2 && mouseY < this.y+cardSize/2;
    }
}