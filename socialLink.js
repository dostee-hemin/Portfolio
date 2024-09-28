let socialsJSON;
let socialLinks = [];

function setupSocialLinks() {
    socialLinks = [];

    for(let social=0; social<socialsJSON.length; social++) {
        let x = widthDiv2-unitSize*11.7;
        let y = lowestYCoordinate + social*unitSize*6;
        socialLinks.push(new SocialLink(x,y, socialsJSON[social].text,socialsJSON[social].icon,socialsJSON[social].link));
    }
    lowestYCoordinate += socialsJSON.length*unitSize*6;
}


class SocialLink {
    constructor(x, y, linkText, icon, link) {
        this.x = x;
        this.y = y;
        this.link = link;
        this.linkText = linkText;
        this.icon = icon;

        this.isHovering = false;
        this.targetAnimationAmount = 0;
        this.animationAmount = this.targetAnimationAmount;
    }

    display() {
        noStroke();
        fill(255);
        textFont('LineIcons');
        textAlign(CENTER,CENTER);
        textSize(unitSize*3.5);
        text(this.icon, this.x, this.y);

        fill(255-this.animationAmount*100,255-this.animationAmount*100,255);
        textFont(fontRegular);
        textSize(unitSize*2);
        textAlign(LEFT,CENTER);
        text(this.linkText, this.x+unitSize*3, this.y);
    }

    update() {
        this.animationAmount = lerp(this.animationAmount, this.targetAnimationAmount, 0.4);
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
        return mousePos.x > this.x-unitSize*2 && mousePos.x < this.x+unitSize*2+textWidth(this.linkText) && mousePos.y > this.y-unitSize*2 && mousePos.y < this.y+unitSize*2;
    }
}