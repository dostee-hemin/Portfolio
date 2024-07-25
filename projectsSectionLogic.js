// Contains the name of each category and the list of projects in each category
let categories = [
    {"name": "AI and Machine Learning", "projects": [1]},
    {"name": "Game Development", "projects": [1]},
    {"name": "Simulations", "projects": [1]},
];

// Variables that control how big the category section is drawn
let triangleHeight = 150;
let categoryBaseHeight = 400;

function setupProjectsSection() {
}

function drawProjectsSection() {
    // Variable that starts at the bottom of the screen and goes lower with each category
    let startingY = windowHeight;
    for(let i=0; i<categories.length; i++) {
        let categoryHeight = categories[i].projects.length * categoryBaseHeight;

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
        fill(255);
        noStroke();
        textSize(40);
        textAlign(i%2 == 0 ? LEFT : RIGHT,CENTER);
        text(categories[i].name,i%2 == 0 ? 60 : width-60,startingY+triangleHeight*0.8);

        startingY += categoryHeight+triangleHeight;
    }
}