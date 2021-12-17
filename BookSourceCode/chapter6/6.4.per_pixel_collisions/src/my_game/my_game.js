"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionCollector = "assets/minion_collector.png";
        this.kMinionPortal = "assets/minion_portal.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;
        this.mCollector = null;
        this.mPortal = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionCollector);
        engine.texture.load(this.kMinionPortal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionCollector);
        engine.texture.unload(this.kMinionPortal);
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

        this.mDyePack = new DyePack(this.kMinionSprite);
        this.mDyePack.setVisibility(false);

        this.mCollector = new TextureObject(this.kMinionCollector, 50, 30, 30, 30);
        this.mPortal = new TextureObject(this.kMinionPortal, 70, 30, 10, 10);


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
        this.mCollector.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mDyePack.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let msg = "No Collision";

        this.mCollector.update(engine.input.keys.W, engine.input.keys.S,
            engine.input.keys.A, engine.input.keys.D);
        this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
            engine.input.keys.Left, engine.input.keys.Right);

        let h = [];

        // Portal's resolution is 1/16 x 1/16 that of Collector!
        // if (this.mCollector.pixelTouches(this.mPortal, h)) {  // <-- VERY EXPENSIVE!!
        if (this.mPortal.pixelTouches(this.mCollector, h)) {
            msg = "Collided!: (" + h[0].toPrecision(4) + " " + h[1].toPrecision(4) + ")";
            this.mDyePack.setVisibility(true);
            this.mDyePack.getXform().setXPos(h[0]);
            this.mDyePack.getXform().setYPos(h[1]);
        } else {
            this.mDyePack.setVisibility(false);
        }
        this.mMsg.setText(msg);

    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}