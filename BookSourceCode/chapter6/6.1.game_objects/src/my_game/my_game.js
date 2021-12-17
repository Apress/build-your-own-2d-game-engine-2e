"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import DyePack from "./objects/dye_pack.js";
import Minion from "./objects/minion.js";
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
        this.mMinionset = null;
        this.mDyePack = null;
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
        // 
        // Step B: The dye pack: simply another GameObject
        this.mDyePack = new DyePack(this.kMinionSprite);

        // Step C: A set of Minions
        this.mMinionset = new engine.GameObjectSet();
        let i = 0, randomY, aMinion;
        // create 5 minions at random Y values
        for (i = 0; i < 5; i++) {
            randomY = Math.random() * 65;
            aMinion = new Minion(this.kMinionSprite, randomY);
            this.mMinionset.addToSet(aMinion);
        }

        // Step D: Create the hero object
        this.mHero = new Hero(this.kMinionSprite);

        // Step E: Create and initialize message output
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

        // Step  C: draw everything
        this.mHero.draw(this.mCamera);
        this.mMinionset.draw(this.mCamera);
        this.mDyePack.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mHero.update();
        this.mMinionset.update();
        this.mDyePack.update();
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}