/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Accessing engine internal is not ideal, 
//      this must be resolved! (later)
import * as loop from "../engine/core/loop.js";

// Engine stuff
import engine from "../engine/index.js";

// local stuff
import SceneFileParser from "./util/scene_file_parser.js";

class MyGame  {
    constructor() {
        // scene file name
        this.mSceneFile = "assets/scene.xml";
        // all squares
        this.mSqSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.mCamera = null;
    }

    init() {    
        let sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile));

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares
        sceneParser.parseSquares(this.mSqSet);
    }


    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);

        this.mCamera.setViewAndCameraMatrix();
        // Step B: draw all the squares
        let i;
        for (i = 0; i < this.mSqSet.length; i++) {
            this.mSqSet[i].draw(this.mCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the white square and pulse the red

        let xform = this.mSqSet[0].getXform();
        let deltaX = 0.05;

        // Step A: test for white square movement
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(10, 60);
            }
            xform.incXPosBy(deltaX);
        }

        // Step B: test for white square rotation
        if (engine.input.isKeyClicked(engine.input.keys.Up)) {
            xform.incRotationByDegree(1);
        }

        xform = this.mSqSet[1].getXform();
        // Step C: test for pulsing the red square
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (xform.getWidth() > 5) {
                xform.setSize(2, 2);
            }
            xform.incSizeBy(0.05);
        }
    }

    load() {
        engine.xml.load(this.mSceneFile);
    }

    unload() {
        // unload the scene flie and loaded resources
        engine.xml.unload(this.mSceneFile);
    }
}


window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();    
    
    // starts the game loop
    loop.start(myGame);
}