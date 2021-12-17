/*
 * File: my_game_main.js 
 * Implementation of Scene methods for MyGame
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mLMinion = null;
        this.mRMinion = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 1900, 0, 1000);
        bgR.getXform().setSize(190, 100);
        bgR.getXform().setPosition(50, 35);
        this.mBg = new engine.GameObject(bgR);

        this.mHero = new Hero(this.kMinionSprite);

        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set up the camera and draw
        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);

        this.mMsg.draw(this.mCamera); // draw last
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let deltaAmbient = 0.01;
        let msg = "Current Ambient]: ";

        this.mCamera.update();  // to ensure proper interpolated movement effects
        this.mLMinion.update(); // ensure sprite animation
        this.mRMinion.update();
        this.mHero.update();  // allow keyboard control to move
        this.mCamera.panWith(this.mHero.getXform(), 0.8);

        let v = engine.defaultResources.getGlobalAmbientColor();
        if (engine.input.isButtonPressed(engine.input.eMouseButton.eLeft)) {
            v[0] += deltaAmbient;
        }

        if (engine.input.isButtonPressed(engine.input.eMouseButton.eMiddle)) {
            v[0] -= deltaAmbient;
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            engine.defaultResources.setGlobalAmbientIntensity(engine.defaultResources.getGlobalAmbientIntensity() - deltaAmbient);
        }

        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            engine.defaultResources.setGlobalAmbientIntensity(engine.defaultResources.getGlobalAmbientIntensity() + deltaAmbient);
        }

        msg += " Red=" + v[0].toPrecision(3) + " Intensity=" + engine.defaultResources.getGlobalAmbientIntensity().toPrecision(3);
        this.mMsg.setText(msg);
    }
}

export default MyGame;