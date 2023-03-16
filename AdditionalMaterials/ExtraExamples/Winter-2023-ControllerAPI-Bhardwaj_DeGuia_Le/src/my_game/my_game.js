"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

import Player from "./objects/player.js";

import Ball from "./objects/ball.js";

// user stuff


class MyGame extends engine.Scene {
    constructor() {
        super();
        // The camera to view the scene
        this.mCamera = null;

        // For echo message
        this.mMsg = null;
        this.playerMsg = null;

        this.kPlayer = "assets/square.png";
        // the hero and the support objects
        this.numPlayers = 0;
        this.players = [];
        this.playerColors = [
            [1, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 0, 1],
            [1, 1, 0, 1]
        ];

        this.mBall = null;
        this.mBallPos = [];
        this.lastPlayerTouched = -1;

        this.isStarted = false;
        this.isPaused = false;
        this.isGoal = false;

        this.timer = false;
        this.timerNum = 0;

    }

    load() {
        engine.texture.load(this.kPlayer);
    }

    unload() {
        engine.texture.unload(this.kPlayer);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0),   // position of the camera
            100,                       // width of camera
            [0, 0, 600, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mMsg = new engine.FontRenderable("P1, press [A] to start!");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(-32.5, 0.5);
        this.mMsg.setTextHeight(5);
        this.playerMsg = new engine.FontRenderable("P");
        this.playerMsg.setColor([0, 0, 0, 1]);
        this.playerMsg.getXform().setPosition(0, -10);
        this.playerMsg.setTextHeight(5);

        
        let newPlayer = new Player(this.kPlayer, [0, -50 + 2], 0, this.playerColors[0], false);
        this.players[0] = newPlayer;
        newPlayer = new Player(this.kPlayer, [0, 50 - 2], 1, this.playerColors[1], false);
        this.players[1] = newPlayer;
        newPlayer = new Player(this.kPlayer, [50 - 2, 0], 2, this.playerColors[2], true);
        this.players[2] = newPlayer;
        newPlayer = new Player(this.kPlayer, [-50 + 2, 0], 3, this.playerColors[3], true);
        this.players[3] = newPlayer;

        this.mBall = new Ball(this.kPlayer, 0, 0);

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();

        this.mBall.draw(this.mCamera);

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].draw(this.mCamera);
        }

        

        if (this.isPaused || !this.isStarted) {
            this.mMsg.draw(this.mCamera);
        }
        if (this.isGoal) {
            this.mMsg.draw(this.mCamera);
            this.playerMsg.draw(this.mCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.numPlayers = engine.input.getNumControllers();
        // this.numPlayers = 4;

        if (this.timer) {
            this.timerNum++;
        }
        if (this.timerNum >= 200) {
            this.timerNum = 0;
            this.isGoal = false;
            this.lastPlayerTouched = -1;
            this.mBall.setSpeed(0, -1);
            this.timer = false;
        }
        let playerCollider
        for (let i = 0; i < this.players.length; i++) {

            if (i < this.numPlayers) {
                this.players[i].setEnabled(true);
                this.players[i].update();

                playerCollider = this.mBall.checkCollisionWithPlayer(this.players[i]);
                if (playerCollider != -1) {
                    this.lastPlayerTouched = playerCollider;
                }
            } else {
                this.players[i].setEnabled(false);
            }
            
        }

        this.mBall.update();
        let goalCollider = this.mBall.checkBounds(this.numPlayers);
        if (goalCollider != -1) {
            this.goal(this.lastPlayerTouched);
        }

        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.A)) { // start
            this.startGame();
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.B)) { // reset
            this.loadGame();
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.X)) { // pause
            this.pause();
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Y)) { // play
            this.play();
        }
        if (engine.input.isKeyClicked(engine.input.keys.A)) { // start
            this.startGame();
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) { // reset
            this.loadGame();
        }
        if (engine.input.isKeyClicked(engine.input.keys.X)) { // pause
            this.pause();
        }
        if (engine.input.isKeyClicked(engine.input.keys.Y)) { // play
            this.play();
        }


        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.B)) {
        //     console.log("B button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.B)) {
        //     console.log("B button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.A)) {
        //     console.log("A button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.A)) {
        //     console.log("A button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.X)) {
        //     console.log("X button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.X)) {
        //     console.log("X button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Y)) {
        //     console.log("Y button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Y)) {
        //     console.log("Y button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftBumper)) {
        //     console.log("LeftBumper Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftBumper)) {
        //     console.log("LeftBumper Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightBumper)) {
        //     console.log("RightBumper Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightBumper)) {
        //     console.log("RightBumper Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftTrigger)) {
        //     console.log("LeftTrigger Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftTrigger)) {
        //     console.log("LeftTrigger Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightTrigger)) {
        //     console.log("RightTrigger Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightTrigger)) {
        //     console.log("RightTrigger Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Back)) {
        //     console.log("Back button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Back)) {
        //     console.log("Back button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Start)) {
        //     console.log("Start button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Start)) {
        //     console.log("Start button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftJoystickButton)) {
        //     console.log("LeftJoystick button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftJoystickButton)) {
        //     console.log("LeftJoystick button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightJoystickButton)) {
        //     console.log("RightJoystick button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightJoystickButton)) {
        //     console.log("RightJoystick button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadUp)) {
        //     console.log("PlusPadUp button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadUp)) {
        //     console.log("PlusPadUp button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadDown)) {
        //     console.log("PlusPadDown button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadDown)) {
        //     console.log("PlusPadDown button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadLeft)) {
        //     console.log("PlusPadLeft button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadLeft)) {
        //     console.log("PlusPadLeft button Released");
        // }
        // if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadRight)) {
        //     console.log("PlusPadRight button Clicked");
        // }
        // if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadRight)) {
        //     console.log("PlusPadRight button Released");
        // }

        // if (engine.input.isJoystickActive(0, engine.input.joysticks.Left)) {
        //     console.log("Left joystick pos: (" + 
        //         engine.input.getJoystickPosX(0, engine.input.joysticks.Left),
        //         engine.input.getJoystickPosY(0, engine.input.joysticks.Left)
        //     );
        // }
        // if (engine.input.isJoystickActive(0, engine.input.joysticks.Right)) {
        //     console.log("Right joystick pos: (" + 
        //         engine.input.getJoystickPosX(0, engine.input.joysticks.Left),
        //         engine.input.getJoystickPosY(0, engine.input.joysticks.Right)
        //     );
        // }
    }

    goal(player) {
        this.isGoal = true;
        this.mBall.setSpeed(0, 0);
        this.mBall.reset(); 
        this.mMsg.setText("GOAL!");
        if (player != -1) {
            this.playerMsg.setText("P" + (player + 1));
            this.playerMsg.setColor(this.playerColors[player]);
            this.players[player].scoreGoal();
        } else {
            this.playerMsg.setText("No One!");
            this.playerMsg.setColor([0, 0, 0, 1]);
        }
        this.timer = true;
    }

    loadGame() {
        this.isStarted = false;
        this.isPaused = false;
        this.isGoal = false;
        this.timer = false;
        this.timerNum = 0;
        this.mMsg = new engine.FontRenderable("P1, press [A] to start!");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(-32.5, 0.5);
        this.mMsg.setTextHeight(5);

        this.mBall.setSpeed(0, 0);
        this.mBall.reset();
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].reset();
        }
    }

    startGame() {
        if (!this.isStarted) {
           this.mMsg.getXform().setPosition(-10, 0);
            this.mMsg.setTextHeight(10);
            this.mBall.setSpeed(0, -1); 
            this.isStarted = true;
        }
        
    }

    pause() {
        if (!this.isPaused && !this.isGoal) {
            this.mBallPos = [this.mBall.getSpeedX(), this.mBall.getSpeedY()];
            this.mBall.setSpeed(0, 0);
            this.mMsg.setText("PAUSED");
            this.isPaused = true;
        }
        
    }

    play() {
        if (this.isPaused && !this.isGoal) {
           this.mBall.setSpeed(this.mBallPos[0], this.mBallPos[1]);
            this.mBallPos = [];
            this.isPaused = false; 
        }
        
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}