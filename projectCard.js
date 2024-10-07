class ProjectCard {
    constructor(x, y, project_info) {
        this.x = x;
        this.y = y;
        this.img = null;
        if(project_info.image_path.split(".").length > 2) this.img = loadImage(project_info.image_path);
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
        
        if(this.img == null) {
            const canvas = document.getElementById("defaultCanvas0");
            const ctx = canvas.getContext("2d");
            let gradient = ctx.createLinearGradient(-cardSize*0.5,-cardSize*0.5,cardSize*0.5,cardSize*0.5);
            gradient.addColorStop(0, color('#115CF0'));
            gradient.addColorStop(1, color('#930980'));
            ctx.fillStyle = gradient;
            noStroke();
            rectMode(CENTER);
            rect(0,0,cardSize,cardSize);
        } else {
            if(this.img.width != cardSize) this.img.resize(cardSize, cardSize);
            imageMode(CENTER);
            image(this.img, 0, 0);
        }
        
        // Black gradient
        const canvas = document.getElementById("defaultCanvas0");
        const ctx = canvas.getContext("2d");
        let gradient = ctx.createLinearGradient(0,cardSize*(0.1-this.hoverAmnt*0.6),0,cardSize*(0.5001 - this.hoverAmnt));
        gradient.addColorStop(0, color(0, 0));
        gradient.addColorStop(1, color(0, 230));
        ctx.fillStyle = gradient;
        noStroke();
        rectMode(CORNER);
        rect(-cardSize/2,cardSize*(0.1-this.hoverAmnt*0.6),cardSize,cardSize*(0.4+ this.hoverAmnt*0.6)+0.5);

        // Name
        fill(0);
        textSize(map(this.name.length,1,20,unitSize*3.2,unitSize*2.2));
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        text(this.name, cardSize*-0.4+unitSize*0.2, cardSize*(0.37 - this.hoverAmnt*0.7)+unitSize*0.2);
        fill(255);
        textSize(map(this.name.length,1,20,unitSize*3.2,unitSize*2.2));
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        text(this.name, cardSize*-0.4, cardSize*(0.37 - this.hoverAmnt*0.7));

        // Description
        noStroke();
        fill(220, map(this.hoverAmnt,0.7,1,0,255));
        textSize(unitSize*2);
        textAlign(LEFT,TOP);
        textFont(fontRegular);
        let fittedText = "";
        let words = this.description.split(" ");
        for(let i=0; i<words.length; i++) {
            if(textWidth(fittedText + words[i] + " ") > cardSize*0.8) fittedText += "\n";
            fittedText += words[i] + " ";
        }
        text(fittedText, cardSize*-0.4, cardSize*-0.25);

        let toolX = cardSize*-0.4+unitSize;
        let toolY = cardSize*0.3;
        textSize(cardSize*0.04);
        textAlign(LEFT,CENTER);
        textFont(fontBold);
        for(let i=0; i<this.tools.length; i++) {
            let tool = this.tools[i];

            if(toolX+textWidth(tool) > cardSize*0.4) {
                toolX = cardSize*-0.4+unitSize;
                toolY += textAscent(tool)*2;
            }

            stroke(100,map(this.hoverAmnt,0.7,1,0,255));
            strokeWeight(textAscent(tool)*1.5);
            line(toolX,toolY,toolX+textWidth(tool),toolY);
            
            noStroke();
            fill(255,map(this.hoverAmnt,0.7,1,0,255));
            text(tool,toolX,toolY-2);


            toolX += textWidth(tool) + unitSize*3;
        }
        pop();
    }

    update() {
        this.hoverAmnt = lerp(this.hoverAmnt, this.targetHoverAmnt, 0.1);

        if(this.isUnderMouse()) {
            if(!this.isHovering) {
                this.targetHoverAmnt = 1;
                if(this.link != "") cursor('pointer');
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
        return mousePos.x > this.x-cardSize/2 && mousePos.x < this.x+cardSize/2 && mousePos.y > this.y-cardSize/2 && mousePos.y < this.y+cardSize/2;
    }

    isNotVisible() {
        return window.scrollY > this.y+cardSize/2 || window.scrollY+windowHeight < this.y-cardSize/2;
    }
}