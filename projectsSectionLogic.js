// Contains the name of each category and the list of projects in each category
let categories;

// Variables that control how big the category section is drawn
let triangleHeight = 150;
let categoryBaseHeight;

let cardSize = 350;
let numColumns;

let cards=[];

function setupProjectsSection() {
    cards = [];
    categoryBaseHeight = cardSize * 1.3;
    numColumns = int(width*0.8/cardSize);
    let currentY = windowHeight+triangleHeight+parallaxPosition;
    for(let category=0; category<categories.length; category++) {
        for(let project=0; project<categories[category].projects.length; project++) {
            let currentProject = categories[category].projects[project]; 

            let x = (width-120)/numColumns * (project%numColumns+0.5) + 60;
            if (category%2 != 0) {x = width - x;}
            let y = currentY+(int(project/numColumns)+0.5) * categoryBaseHeight;

            cards.push(new ProjectCard(x, y, currentProject));
        }
        currentY += ceil(categories[category].projects.length/numColumns) * categoryBaseHeight + triangleHeight;
    }

    lowestYCoordinate = currentY-parallaxPosition-500;
}

function drawProjectsSection() {
    // Variable that starts at the bottom of the screen and goes lower with each category
    let startingY = windowHeight;
    let gradientHeight = triangleHeight;
    for(let i=0; i<categories.length; i++) {
        let categoryHeight = ceil(categories[i].projects.length/numColumns) * categoryBaseHeight;

        // Draw the upper and lower triangles, the middle rectangle, and the name underline.
        // Categories alternate between being drawn from the left and from the right 
        push();
        translate(i%2 == 0? 0 : width, startingY);
        fill(3,map(i,0,categories.length,20,70),map(i,0,categories.length,50,120));
        noStroke();
        scale(i%2 == 0 ? 1 : -1, 1);
        triangle(0,0,width,triangleHeight+1,0,triangleHeight+1);
        rectMode(CORNER);
        rect(0,triangleHeight,width,categoryHeight);
        triangle(0,triangleHeight+categoryHeight-2,width,triangleHeight+categoryHeight-2,0,triangleHeight*2+categoryHeight+5);
        stroke(200);
        strokeWeight(3);
        line(60,triangleHeight,60+categories[i].name.length * 24,triangleHeight);
        translate(width/2,triangleHeight/2-gradientHeight/2);
        // Black gradient
        const canvas = document.getElementById("defaultCanvas0");
        const ctx = canvas.getContext("2d");
        let gradient = ctx.createLinearGradient(0,0,0,gradientHeight);
        gradient.addColorStop(0, color(0, 0));
        gradient.addColorStop(1, color(0, 230));
        ctx.fillStyle = gradient;
        noStroke();
        rectMode(CENTER);
        rotate(atan(triangleHeight/width));
        rect(0,0,width+100,gradientHeight);
        pop();

        // Draw the category name
        textFont(fontBold);
        fill(255);
        noStroke();
        textSize(40);
        textAlign(i%2 == 0 ? LEFT : RIGHT,CENTER);
        text(categories[i].name,i%2 == 0 ? 60 : width-60,startingY+triangleHeight*0.8);

        startingY += categoryHeight+triangleHeight;
    }
}