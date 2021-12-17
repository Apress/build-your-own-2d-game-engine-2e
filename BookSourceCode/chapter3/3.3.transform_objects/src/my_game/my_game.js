/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame {
    constructor(htmlCanvasID) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Create the Renderable objects:
        this.mWhiteSq = new engine.Renderable();
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([1, 0, 0, 1]);

        // Step C: Draw!
        engine.clearCanvas([0, 0.8, 0, 1]);   // 1. Clear the canvas

        // instead of simply drawing the squares, let's apply simple transforms
        // Step D: sets the blue Renderable object's transform
        this.mWhiteSq.getXform().setPosition(-0.25, 0.25);
        this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radians
        this.mWhiteSq.getXform().setSize(1.2, 1.2);
        // Step E: draws the blue square (transform behavior in the object)
        this.mWhiteSq.draw();

        // Step F: sets the red square transform    
        this.mRedSq.getXform().setXPos(0.25);  // to show alternative to setPosition
        this.mRedSq.getXform().setYPos(-0.25); // it is possible to setX/Y separately
        this.mRedSq.getXform().setRotationInDegree(45);  // this is in Degree
        this.mRedSq.getXform().setWidth(0.4);  // to show alternative to setSize
        this.mRedSq.getXform().setHeight(0.4);  // that it is possible to width/height separately
        // Step G: draw the red square (transform in the object)
        this.mRedSq.draw();
    }
}

window.onload = function () {
    new MyGame('GLCanvas');
}