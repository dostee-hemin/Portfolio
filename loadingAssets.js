let profileImage;
let fontBold;
let fontRegular;
let fontItalic;

function preload() {
    profileImage = loadImage("./assets/images/Profile Aug 26 2023 - Circle.png");
    fontRegular = loadFont("./assets/fonts/Raleway-Regular.ttf");
    fontBold = loadFont("./assets/fonts/Raleway-Bold.ttf");
    fontItalic = loadFont("./assets/fonts/Raleway-Italic.ttf");

    loadJSON("./assets/data/projects.json", function(loadedData) {
        categories = Object.values(loadedData);
        for(let category=0; category<categories.length; category++) {
            for(let project=0; project<categories[category].projects.length; project++) {
                let image_name = categories[category].projects[project].image_name;
                let image_path = "./assets/images/"+image_name
    
                categories[category].projects[project].image_path = image_path;
            }
        }
    });

    loadJSON("./assets/data/socials.json", function(loadedData) {
        socialsJSON = Object.values(loadedData);
    });

    loadJSON("./assets/data/experience.json", function(loadedData) {
        experiencesJSON = Object.values(loadedData);
    });
}