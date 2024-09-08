let socialsJSON;
let socialLinks = [];

function setupSocialLinks() {
    socialLinks = [];

    for(let social=0; social<socialsJSON.length; social++) {
        let x = width/2-117;
        let y = height - socialsJSON.length*60 + social*60;
        socialLinks.push(new SocialLink(x,y, socialsJSON[social].text,socialsJSON[social].icon,socialsJSON[social].link));
    }
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
        fill(255);
        textFont('LineIcons');
        textAlign(CENTER,CENTER);
        textSize(35);
        text(this.icon, this.x, this.y);

        fill(255-this.animationAmount*100,255-this.animationAmount*100,255);
        textFont(fontRegular);
        textSize(20);
        textAlign(LEFT,CENTER);
        text(this.linkText, this.x+30, this.y);
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
        return mousePos.x > this.x-20 && mousePos.x < this.x+40+textWidth(this.linkText) && mousePos.y > this.y-20 && mousePos.y < this.y+20;
    }
}