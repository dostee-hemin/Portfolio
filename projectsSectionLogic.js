// Contains the name of each category and the list of projects in each category
let categories;

// Variables that control how big the category section is drawn
let triangleHeight;
let categoryBaseHeight;

let cardSize;
let numColumns;

let cards=[];

function setupProjectsSection() {
    cardSize = unitSize*41;
    triangleHeight = unitSize*25;

    cards = [];
    categoryBaseHeight = cardSize * 1.3;
    numColumns = int(width*0.8/cardSize);
    let currentY = windowHeight+triangleHeight+parallaxPosition;
    for(let category=0; category<categories.length; category++) {
        for(let project=0; project<categories[category].projects.length; project++) {
            let currentProject = categories[category].projects[project]; 

            let x = (width-unitSize*12)/numColumns * (project%numColumns+0.5) + unitSize*6;
            if (category%2 != 0) {x = width - x;}
            let y = currentY+(int(project/numColumns)+0.5) * (isMobileDevice?1.7:1)*categoryBaseHeight;

            cards.push(new ProjectCard(x, y, currentProject));
        }
        currentY += ceil(categories[category].projects.length/numColumns) * (isMobileDevice?1.8:1)*categoryBaseHeight + triangleHeight;
    }

    lowestYCoordinate = currentY-parallaxPosition-unitSize*50;
}

function drawProjectsSection() {
    // Variable that starts at the bottom of the screen and goes lower with each category
    let startingY = windowHeight;
    for(let i=0; i<categories.length; i++) {
        let categoryHeight = ceil(categories[i].projects.length/numColumns) * (isMobileDevice?1.8:1)*categoryBaseHeight;
        
        push();
        translate(i%2 == 0? 0 : width, startingY);
        scale(i%2 == 0 ? 1 : -1, 1);

        // Draw the category section as a trapezoid.
        // Categories alternate between being drawn from the left and from the right 
        fill(3,map(i,0,categories.length,20,70),map(i,0,categories.length,50,120));
        noStroke();
        beginShape();
        vertex(0,-unitSize*0.2)
        vertex(width,triangleHeight-unitSize*0.2)
        vertex(width,triangleHeight+categoryHeight)
        vertex(0,triangleHeight*2+categoryHeight)
        endShape(CLOSE);

        drawShadow(triangleHeight);
        pop();

        // Draw the category name
        textFont(fontBold);
        fill(255);
        noStroke();
        textSize(unitSize*4);
        textAlign(i%2 == 0 ? LEFT : RIGHT,CENTER);
        text(categories[i].name,i%2 == 0 ? unitSize*6 : width-unitSize*6,startingY+triangleHeight*0.9);

        startingY += categoryHeight+triangleHeight;
    }
    push();
    translate(categories.length%2 == 0? 0 : width, startingY);
    scale(categories.length%2 == 0 ? 1 : -1, 1);
    drawShadow(triangleHeight);
    pop();
}

function drawShadow(gradientHeight) {
    // Black gradient
    translate(widthDiv2,triangleHeight/2-gradientHeight/2);
    const canvas = document.getElementById("defaultCanvas0");
    const ctx = canvas.getContext("2d");
    let gradient = ctx.createLinearGradient(0,0,0,gradientHeight);
    gradient.addColorStop(0, color(0, 0));
    gradient.addColorStop(1, color(0));
    ctx.fillStyle = gradient;
    noStroke();
    rectMode(CENTER);
    rotate(atan(gradientHeight/width));
    rect(0,0,width+unitSize*10,gradientHeight);
}