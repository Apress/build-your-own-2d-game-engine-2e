"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        // The camera to view the scene
        this.mCamera = null;

        // For echo message
        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;

        // mode of running: 
        //   H: Player drive brain
        //   J: Dye drive brain, immediate orientation change
        //   K: Dye drive brain, gradual orientation change
        this.mMode = 'H';
    }

    load() {
        engine.texture.load(this.kMinionSprite);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5),   // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Create the brain  
        this.mBrain = new Brain(this.kMinionSprite);

        //  Create the hero object 
        this.mHero = new Hero(this.kMinionSprite);

        // For echoing
        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Draw everything
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {

        let msg = "Brain [H:keys J:imm K:gradual]: ";
        let rate = 1;

        this.mHero.update();

        switch (this.mMode) {
            case 'H':
                this.mBrain.update();  // player steers with arrow keys
                break;
            case 'K':
                rate = 0.02;    // gradual rate
                // After "K" is typed (in gradual mode), the following should also be executed.
            case 'J':
                this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), rate);
                engine.GameObject.prototype.update.call(this.mBrain);  // the default GameObject: only move forward
                break;
            }

        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.mMode = 'H';
        }
        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            this.mMode = 'J';
        }
        if (engine.input.isKeyClicked(engine.input.keys.K)) {
            this.mMode = 'K';
        }
        this.mMsg.setText(msg + this.mMode);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}