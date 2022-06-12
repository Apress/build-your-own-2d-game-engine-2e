
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";


class Scene1a extends engine.Scene {
    constructor() {
        super();
       
        this.mCamera = null;
        this.mGameObj = null;
        this.mRenderableBox = null;
    }

    load() {}

    unload() {}

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        
        this.mRenderableBox = new engine.Renderable();
        this.mRenderableBox.setColor([1,0,0,1]);
            
        this.mGameObj = new engine.GameObject(this.mRenderableBox);
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
        let xform = this.mGameObj.getXform();

        this.mGameObj.update();
    }


    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene1a();
    myGame.start();
}