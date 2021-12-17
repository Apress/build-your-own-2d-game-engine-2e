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
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

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
        this.mMsg.getXform().setPosition(2, 4);
        this.mMsg.setTextHeight(3);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0, 1, 0, 1.0]); // clear to bright green

        // Step  B: Draw with all three cameras
        this.mCamera.setViewAndCameraMatrix();

        // Step C: Draw everything
        this.mBg.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let zoomDelta = 0.05;
        let msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";

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

        this.mMsg.setText(msg + this.mChoice);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}