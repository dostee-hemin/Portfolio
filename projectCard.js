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
        translate(this.x, this.y - this.hoverAmnt * 10);
        imageMode(CENTER);
        noTint();
        image(this.img, 0, 0, cardSize, cardSize);

        noStroke();
        for(let i=0; i<=cardSize*0.3; i+=6) {
            fill(0, i/(cardSize*0.3) * 200);
            rectMode(CENTER);
            rect(0,cardSize*(0.2-this.hoverAmnt*0.7)+i-3,cardSize, 6);
        }
        noStroke();
        fill(0, 200);
        rectMode(CORNER);
        rect(-cardSize/2,cardSize*(0.5 - this.hoverAmnt*0.7),cardSize,cardSize*this.hoverAmnt*0.7);

        fill(255);
        textSize(map(this.name.length,1,20,32,22));
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        text(this.name, cardSize*-0.4, cardSize*(0.37 - this.hoverAmnt*0.7));

        fill(220, map(this.hoverAmnt,0.8,1,0,255));
        textSize(18);
        textAlign(LEFT,TOP);
        textFont(fontRegular);
        let fittedText = ""
        let chunk = "";
        let words = this.description.split(" ");
        for(let i=0; i<words.length; i++) {
            if(textWidth(chunk+words[i]) > cardSize*0.8) {
                fittedText += chunk + "\n";
                chunk = "";
            }
            chunk += words[i] + " ";

        }
        if(chunk != "") fittedText += chunk;
        text(fittedText, cardSize*-0.4, cardSize*-0.2);

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

            stroke(130,map(this.hoverAmnt,0.2,1,0,255));
            strokeWeight(20);
            line(toolX,toolY,toolX+textWidth(tool),toolY);
            
            noStroke();
            fill(255,map(this.hoverAmnt,0.2,1,0,255));
            text(tool,toolX,toolY-2);


            toolX += textWidth(tool) + 30;
        }
        pop();
    }

    update() {
        this.hoverAmnt = lerp(this.hoverAmnt, this.targetHoverAmnt, 0.1);

        if(this.isUnderMouse()) {
            if(!this.isHovering) this.targetHoverAmnt = 1;
            this.isHovering = true;
        } else {
            if(this.isHovering) this.targetHoverAmnt = 0;
            this.isHovering = false;
        }
    }

    isUnderMouse() {
        return mouseX > this.x-cardSize/2 && mouseX < this.x+cardSize/2 && mouseY > this.y-cardSize/2 && mouseY < this.y+cardSize/2;
    }
}