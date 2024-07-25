// Contains the name of each category and the list of projects in each category
let categories;

// Variables that control how big the category section is drawn
let triangleHeight = 150;
let categoryBaseHeight = 400;

let cardSize = 300;
let numColumns = 4;

let cards=[];

function setupProjectsSection() {
    let currentY = windowHeight+triangleHeight;
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
}

function drawProjectsSection() {
    // Variable that starts at the bottom of the screen and goes lower with each category
    let startingY = windowHeight;
    for(let i=0; i<categories.length; i++) {
        let categoryHeight = ceil(categories[i].projects.length/numColumns) * categoryBaseHeight;

        // Draw the upper and lower triangles, the middle rectangle, and the name underline.
        // Categories alternate between being drawn from the left and from the right 
        push();
        translate(i%2 == 0? 0 : width, startingY);
        fill(3,map(i,0,categories.length,20,70),map(i,0,categories.length,50,120));
        noStroke();
        scale(i%2 == 0 ? 1 : -1, 1);
        triangle(0,0,width,triangleHeight,0,triangleHeight);
        rectMode(CORNER);
        rect(0,triangleHeight,width,categoryHeight);
        triangle(0,triangleHeight+categoryHeight,width,triangleHeight+categoryHeight,0,triangleHeight*2+categoryHeight);
        stroke(200);
        strokeWeight(3);
        line(60,triangleHeight,60+categories[i].name.length * 24,triangleHeight);
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

    for(let i=0; i<cards.length; i++) {
        let card = cards[i];

        card.update();
        card.display();
    }
}