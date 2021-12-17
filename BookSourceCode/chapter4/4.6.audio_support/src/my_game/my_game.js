/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!


// Engine stuff
import engine from "../engine/index.js";

// User stuff
import BlueLevel from "./blue_level.js";

class MyGame extends engine.Scene {

    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.mBackgroundAudio = "assets/sounds/bg_clip.mp3";
        this.mCue = "assets/sounds/my_game_cue.wav";

        // The camera to view the scene
        this.mCamera = null;

        // the hero and the support objects
        this.mHero = null;
        this.mSupport = null;
    }

    load() {
        // loads the audios
        engine.audio.load(this.mBackgroundAudio);
        engine.audio.load(this.mCue);
    }

    init() {    
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // Step B: Create the support object in red
        this.mSupport = new engine.Renderable();
        this.mSupport.setColor([0.8, 0.2, 0.2, 1]);
        this.mSupport.getXform().setPosition(20, 60);
        this.mSupport.getXform().setSize(5, 5);

        // Setp C: Create the hero object in blue
        this.mHero = new engine.Renderable();
        this.mHero.setColor([0, 0, 1, 1]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);

        // now start the Background music ...
        engine.audio.playBackground(this.mBackgroundAudio, 1.0);
    }


    unload() {
        // Step A: Game loop not running, unload all assets
        // stop the background audio
        engine.audio.stopBackground();

        // unload the scene resources
        engine.audio.unload(this.mBackgroundAudio);
        engine.audio.unload(this.mCue);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: draw everything
        this.mSupport.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero, 
        // and if hero moves too far off, this level ends, we will
        // load the next level
        let deltaX = 0.05;
        let xform = this.mHero.getXform(); 

        // Support hero movements
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            engine.audio.playCue(this.mCue, 0.5);
            engine.audio.incBackgroundVolume(0.05);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            engine.audio.playCue(this.mCue, 1.5);
            engine.audio.incBackgroundVolume(-0.05);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                this.next();
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game
    }

    next() {      
        super.next();  // this must be called!

        // next scene to run
        let nextLevel = new BlueLevel();  // next level to be loaded
        nextLevel.start();
    }
}
export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}