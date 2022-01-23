"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

import Hero from "./hero.js";

// potential texture: https://www.pngall.com/spot-light-png/download/68214

class MyGame extends engine.Scene {
    constructor() {
        super();

        this.kMinionSprite = "assets/minion_sprite.png";
        this.kUp = "assets/up.png";
        this.kTest = "assets/pete.png";
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;
        this.mHero = null;
        this.mTest = null;

        this.mMsg = null;

        this.mU = 0.5;
        this.mV = 0.5;
        this.mW = 0.3;
        this.mH = 0.3; 
        this.mTheta = 0;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kUp);
        engine.texture.load(this.kTest);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kUp);
        engine.texture.unload(this.KTest);
        engine.texture.unload(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 40), // position of the camera
            100,                       // width of camera
            [0, 0, 1000, 800]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(150, 150);
        this.mBg.getXform().setPosition(50, 40);

        this.mTest = new engine.TextureRenderable(this.kTest, this.kUp);
        this.mTest.getXform().setSize(50, 30);
        this.mTest.getXform().setPosition(50, 40);
        this.mTest.setSecondTexture(this.mU, this.mV, this.mW, this.mH, this.mTheta);

        this.mHero = new Hero(this.kMinionSprite, 50, 40);
    
        this.mMsg = new engine.FontRenderable("Status Message:");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(2, 3);
        this.mMsg.setTextHeight(3);
        this.mMsg.setText("At:(" 
                + this.mU.toPrecision(2).toString() + "," 
                + this.mV.toPrecision(2).toString() + ") Size:(" 
                + this.mW.toPrecision(2).toString() + "," 
                + this.mH.toPrecision(2).toString() + ")");
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        
        this.mBg.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mTest.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let once = false;

        this.mHero.update();

        let xdelta = 0.3;
        let delta = 0.005;
        let xform = this.mTest.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mH += delta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                    this.mV += delta;
            else xform.incYPosBy(xdelta);
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mH -= delta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                    this.mV -= delta;
            else xform.incYPosBy(-xdelta);
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mW += delta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                    this.mU += delta;
            else xform.incXPosBy(xdelta);
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mW -= delta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                    this.mU -= delta;
            else xform.incXPosBy(-xdelta);
            once = true;
        }
        if (once) {
            this.mTest.setSecondTexture(this.mU, this.mV, this.mW, this.mH, this.mTheta);    
            this.mMsg.setText("At:(" 
                + this.mU.toPrecision(2).toString() + "," 
                + this.mV.toPrecision(2).toString() + ") Size:(" 
                + this.mW.toPrecision(2).toString() + "," 
                + this.mH.toPrecision(2).toString() + ")");
        }
        
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
