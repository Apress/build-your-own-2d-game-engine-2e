/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// import from engine internal is not desirable
// we will define Camera class to hide this in the next project
import * as glSys from "../engine/core/gl.js";

import engine from "../engine/index.js";

class MyGame {
    constructor(htmlCanvasID) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Create the Renderable objects:
        this.mBlueSq = new engine.Renderable();
        this.mBlueSq.setColor([0.25, 0.25, 0.95, 1]);
        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([1, 0.25, 0.25, 1]);
        this.mTLSq = new engine.Renderable();
        this.mTLSq.setColor([0.9, 0.1, 0.1, 1]);
        this.mTRSq = new engine.Renderable();
        this.mTRSq.setColor([0.1, 0.9, 0.1, 1]);
        this.mBRSq = new engine.Renderable();
        this.mBRSq.setColor([0.1, 0.1, 0.9, 1]);
        this.mBLSq = new engine.Renderable();
        this.mBLSq.setColor([0.1, 0.1, 0.1, 1]);

        // Step C: Clear the entire canvas first
        engine.clearCanvas([0.9, 0.9, 0.9, 1]);   // Clear the canvas

        
        // get access to the gl connection to the GPU
        let gl = glSys.get();

        // Step D: Setting up Viewport
        // Step D1: Set up the viewport: area on canvas to be drawn
        gl.viewport(
            20,     // x position of bottom-left corner of the area to be drawn
            40,     // y position of bottom-left corner of the area to be drawn
            600,    // width of the area to be drawn
            300);     // height of the area to be drawn

        // Step D2: set up the corresponding scissor area to limit clear area
        gl.scissor(
            20,     // x position of bottom-left corner of the area to be drawn
            40,     // y position of bottom-left corner of the area to be drawn
            600,    // width of the area to be drawn
            300);    // height of the area to be drawn

        // Step D3: enable the scissor area, clear, and then disable the scissor area
        gl.enable(gl.SCISSOR_TEST);
        engine.clearCanvas([0.8, 0.8, 0.8, 1.0]);  // clear the scissor area
        gl.disable(gl.SCISSOR_TEST);


        // Step E: Set up camera transform matrix
        // assume camera position and dimension
        let cameraCenter = vec2.fromValues(20, 60);
        let wcSize = vec2.fromValues(20, 10);
        let cameraMatrix = mat4.create();
        // Step E1: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(cameraMatrix, mat4.create(), vec3.fromValues(2.0 / wcSize[0], 2.0 / wcSize[1], 1.0));

        // Step E2: first operation to perform is to translate camera center to the origin
        mat4.translate(cameraMatrix, cameraMatrix, vec3.fromValues(-cameraCenter[0], -cameraCenter[1], 0));

        // Step F: Draw the blue square
        // Center Blue, slightly rotated square
        this.mBlueSq.getXform().setPosition(20, 60);
        this.mBlueSq.getXform().setRotationInRad(0.2); // In Radians
        this.mBlueSq.getXform().setSize(5, 5);
        this.mBlueSq.draw(cameraMatrix);

        // Step G: Draw the center and the corner squares
        // center red square
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);
        this.mRedSq.draw(cameraMatrix);

        // top left
        this.mTLSq.getXform().setPosition(10, 65);
        this.mTLSq.draw(cameraMatrix);

        // top right
        this.mTRSq.getXform().setPosition(30, 65);
        this.mTRSq.draw(cameraMatrix);

        // bottom right
        this.mBRSq.getXform().setPosition(30, 55);
        this.mBRSq.draw(cameraMatrix);

        // bottom left
        this.mBLSq.getXform().setPosition(10, 55);
        this.mBLSq.draw(cameraMatrix);
    }
}

window.onload = function () {
    new MyGame('GLCanvas');
}