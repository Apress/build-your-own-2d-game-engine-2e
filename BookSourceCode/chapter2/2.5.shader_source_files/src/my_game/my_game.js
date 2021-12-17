/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as engine from "../engine/core.js";

class MyGame {
    constructor(htmlCanvasID) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Clear the canvas
        engine.clearCanvas([0, 0.8, 0, 1]);

        // Step C: Draw the square
        engine.drawSquare();
    }
}

window.onload = function() {
    new MyGame('GLCanvas');
}