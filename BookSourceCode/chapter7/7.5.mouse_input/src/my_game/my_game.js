"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import TextureObject from "./objects/texture_object.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;
        this.mBrainCam = null;
        this.mBg = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;
        this.mFocusObj = null;

        this.mChoice = 'D';
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 36), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 330]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mHeroCam = new engine.Camera(
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to hero
            20,
            [490, 330, 150, 150],
            2                           // viewport bounds
        );
        this.mHeroCam.setBackgroundColor([0.85, 0.8, 0.8, 1]);

        this.mBrainCam = new engine.Camera(
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to the brain
            10,
            [0, 330, 150, 150],
            2                           // viewport bounds
        );
        this.mBrainCam.setBackgroundColor([0.8, 0.8, 0.85, 1]);
        this.mBrainCam.configLerp(0.7, 10);
        // Large background image
        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(150, 150);
        bgR.getXform().setPosition(50, 35);
        this.mBg = new engine.GameObject(bgR);

        // Objects in the scene
        this.mBrain = new Brain(this.kMinionSprite);
        this.mHero = new Hero(this.kMinionSprite);
        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);
        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
        this.mFocusObj = this.mHero;

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 14);
        this.mMsg.setTextHeight(3);

        // create an Oscillate object to simulate motion
        this.mBounce = new engine.Oscillate(2, 6, 120); // delta, freq, duration
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);
        this.mHero.draw(camera);
        this.mBrain.draw(camera);
        this.mPortal.draw(camera);
        this.mLMinion.draw(camera);
        this.mRMinion.draw(camera);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this._drawCamera(this.mHeroCam);
        this._drawCamera(this.mBrainCam);

    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let zoomDelta = 0.05;
        let msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";

        this.mCamera.update();  // for smoother camera movements
        this.mHeroCam.update();
        this.mBrainCam.update();

        this.mLMinion.update();  // for sprite animation
        this.mRMinion.update();

        this.mHero.update();     // for WASD movement
        this.mPortal.update(     // for arrow movement
            engine.input.keys.Up,
            engine.input.keys.Down,
            engine.input.keys.Left,
            engine.input.keys.Right
        );

        // Brain chasing the hero
        let h = [];
        if (!this.mHero.pixelTouches(this.mBrain, h)) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.01);
            engine.GameObject.prototype.update.call(this.mBrain);
        }

        // Pan camera to object
        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            this.mFocusObj = this.mLMinion;
            this.mChoice = 'L';
            this.mCamera.panTo(this.mLMinion.getXform().getXPos(), this.mLMinion.getXform().getYPos());
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mFocusObj = this.mRMinion;
            this.mChoice = 'R';
            this.mCamera.panTo(this.mRMinion.getXform().getXPos(), this.mRMinion.getXform().getYPos());
        }
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mFocusObj = this.mPortal;
            this.mChoice = 'P';
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.mFocusObj = this.mHero;
            this.mChoice = 'H';
        }

        // zoom
        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            this.mCamera.zoomBy(1 - zoomDelta);
        }
        if (engine.input.isKeyClicked(engine.input.keys.M)) {
            this.mCamera.zoomBy(1 + zoomDelta);
        }
        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 - zoomDelta);
        }
        if (engine.input.isKeyClicked(engine.input.keys.K)) {
            this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 + zoomDelta);
        }

        // interaction with the WC bound
        this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
        this.mCamera.clampAtBoundary(this.mPortal.getXform(), 0.8);
        this.mCamera.panWith(this.mHero.getXform(), 0.9);

        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            if (!this.mCamera.reShake())
                this.mCamera.shake([6, 1], [10, 3], 60);

            // also re-start bouncing effect
            this.mBounce.reStart();
        }

        if (!this.mBounce.done()) {
            let d = this.mBounce.getNext();
            this.mHero.getXform().incXPosBy(d);
        }

        // set the hero and brain cams    
        this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        this.mBrainCam.panTo(this.mBrain.getXform().getXPos(), this.mBrain.getXform().getYPos());

        msg = "";
        // testing the mouse input
        if (engine.input.isButtonPressed(engine.input.eMouseButton.eLeft)) {
            msg += "[L Down]";
            if (this.mCamera.isMouseInViewport()) {
                this.mPortal.getXform().setXPos(this.mCamera.mouseWCX());
                this.mPortal.getXform().setYPos(this.mCamera.mouseWCY());
            }
        }

        if (engine.input.isButtonPressed(engine.input.eMouseButton.eMiddle)) {
            if (this.mHeroCam.isMouseInViewport()) {
                this.mHero.getXform().setXPos(this.mHeroCam.mouseWCX());
                this.mHero.getXform().setYPos(this.mHeroCam.mouseWCY());
            }
        }
        if (engine.input.isButtonClicked(engine.input.eMouseButton.eRight)) {
            this.mPortal.setVisibility(false);
        }

        if (engine.input.isButtonClicked(engine.input.eMouseButton.eMiddle)) {
            this.mPortal.setVisibility(true);
        }

        msg += " X=" + engine.input.getMousePosX() + " Y=" + engine.input.getMousePosY();
        this.mMsg.setText(msg);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}