/*
 * File: adventures_of_dye.js 
 * This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import GameLevel_01 from "./game_level_01.js";

class AdventuresOfDye extends engine.Scene {
    constructor() {
        super();
        // The camera to view the scene
        this.mCamera = null;
        this.mMsg = null;
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 1280, 720],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mCamera.setBackgroundColor([0.5, 0.5, 0.9, 1]);

        this.mMsg = new engine.FontRenderable("This is splash screen");
        this.mMsg.setColor([1, 0, 0, 1]);
        this.mMsg.getXform().setPosition(10, 50);
        this.mMsg.setTextHeight(5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        this.mMsg.setText("To be completed"); // ("This is splash Screen");
        this.mMsg.getXform().setPosition(10, 55);
        this.mMsg.draw(this.mCamera);
        this.mMsg.setText("<Space Bar> to Start");
        this.mMsg.getXform().setPosition(10, 45);
        this.mMsg.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // select which character to work with
        if (engine.input.isKeyClicked(engine.input.keys.Space))
            this.next();
    }


    next() {
        super.next();

        // Step B: starts the next level
        // starts the next level
        let nextLevel = new GameLevel_01("Level1");  // next level to be loaded
        nextLevel.start();
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new AdventuresOfDye();
    myGame.start();
}