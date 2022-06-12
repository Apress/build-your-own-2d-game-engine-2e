
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";


class Scene2a extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mGameObj = null;
        this.mRenderable = null;
        this.kTexture = "assets/minion_portal.png";
    }

    load() {
        engine.texture.load(this.kTexture)
    }

    unload() {
        engine.texture.unload(this.kTexture)
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

        this.mRenderable = new TextureRenderable(this.kTexture);

        this.mGameObj = new GameObject(this.mRenderable);
        this.mGameObj.getXform().setSize(20,20);
        this.mGameObj.getXform().setPosition(70,70);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // canvas color
        this.mCamera.setViewAndCameraMatrix();

       this.mGameObj.draw(this.mCamera)

    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
       
    }


    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene2a();
    myGame.start();
}