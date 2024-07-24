// Since the tween library needs an object to create variable transitions, this Animator class will handle all generic animations
class Animator {
    constructor() {
        // Variables related to the size, opacity, and motion of the profile image
        this.profileImageSize = 0;
        this.profileImageAlpha = 0;
        this.profileImageOffset = 0;

        // Variables related to the tetris background size and pattern 
        this.targetDeltaAngleAnim = deltaAngle;
        this.targetRadiusAnim = 0;

        // Variables related to the opacity and motion of the main text under the profile image
        this.titleTextAlpha = 0;
        this.titleTextOffset = 0;

        // Variables related to the opacity and motion of the extra text under the main text
        this.subtitleTextAlpha = 0;
        this.subtitleTextOffset = 0;

        // Variables related to the opacity and motion of the indicator to scroll downwards to see projects
        this.projectsArrowAlpha = 0;
        this.projectsArrowOffset = 0;
    }

    // These animations are called once when the website loads up
    startUpWebsite() {
        p5.tween.manager.addTween(this)
        .addMotions([
            { key: 'targetDeltaAngleAnim', target: targetDeltaAngle},
            { key: 'targetRadiusAnim', target: targetPatternRadius}
        ], 5500, "easeInOutSin")
            .startTween();
        
        p5.tween.manager.addTween(this)
            .addMotions([
                { key: 'profileImageSize', target: 250},
                { key: 'profileImageAlpha', target: 255}
            ], 1000, "easeOutQuad")
            .addMotion('profileImageSize',250, 1000)
            .addMotion('profileImageOffset',100, 1500,"easeInOutSin")
            .startTween();
        
        p5.tween.manager.addTween(this)
            .addMotion('titleTextAlpha',0, 2800)
            .addMotions([
                { key: 'titleTextAlpha', target: 255},
                { key: 'titleTextOffset', target: 50}
            ], 700, "easeInOutQuad")
            .startTween();

        p5.tween.manager.addTween(this)
            .addMotion('subtitleTextAlpha',0, 3000)
            .addMotions([
                { key: 'subtitleTextAlpha', target: 255},
                { key: 'subtitleTextOffset', target: 50}
            ], 700, "easeInOutQuad")
            .startTween();

        p5.tween.manager.addTween(this)
            .addMotion('projectsArrowAlpha',0, 4000)
            .addMotions([
                { key: 'projectsArrowAlpha', target: 255},
                { key: 'projectsArrowOffset', target: 50}
            ], 700, "easeInOutQuad")
            .startTween();
    }
}