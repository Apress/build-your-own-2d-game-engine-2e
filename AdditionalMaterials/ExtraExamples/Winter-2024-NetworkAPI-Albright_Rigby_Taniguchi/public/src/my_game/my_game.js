// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// my_game.js template

"use strict";

import engine from "../engine/index.js";

import { ServerConnection } from "../../multiplayer/serverconnection.js";

class MyServerConnection extends ServerConnection {
    // Your code here...
}

class MyGame extends engine.Scene {
    constructor() {
        super();
    }
  
    init() {
        // this.mServerConnection = new MyServerConnection();

        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0),     // position of the camera
            200,                       // width of camera, height is 150 in our case
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    }

    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
    }

    update() {
        // Your code here...
    }
}

window.onload = function () {
    engine.init("GLCanvas");
    let myGame = new MyGame();
    myGame.start();
}
