/* File: MyGame.js
 *
 * This is game developer's game
 * 
 */
"use strict";

// Engine stuff
import engine from "../engine/index.js";


class MyGame extends engine.Scene {
    constructor() {
        super();

        // textures: 
        this.kController = "assets/controller.png";
        this.kCircle = "assets/circle-semitransparent.png";
        this.kPlusPad = "assets/pluspad-semitransparent.png";
        this.kBumper = "assets/bumper-semitransparent.png";
        this.kTrigger = "assets/trigger-semitransparent.png";
        this.kTriggerFull = "assets/trigger.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mController = null;
        this.mLeftTriggerGraphic = null;
        this.mRightTriggerGraphic = null;

        this.mBButton = null;
        this.mAButton = null;
        this.mXButton = null;
        this.mYButton = null;

        this.mLeftBumper = null;
        this.mRightBumper = null;
        this.mLeftTrigger = null;
        this.mRightTrigger = null;

        this.mBackButton = null;
        this.mStartButton = null;

        this.mLeftJoystick = null;
        this.mRightJoystick = null;

        this.mUpPlusPad = null;
        this.mDownPlusPad = null;
        this.mLeftPlusPad = null;
        this.mRightPlusPad = null;

        this.mButtons = [];
    }

    load() {
        engine.texture.load(this.kController);
        engine.texture.load(this.kCircle);
        engine.texture.load(this.kPlusPad);
        engine.texture.load(this.kBumper);
        engine.texture.load(this.kTrigger);
        engine.texture.load(this.kTriggerFull);
    }

    unload() {
        engine.texture.unload(this.kController);
        engine.texture.unload(this.kCircle);
        engine.texture.unload(this.kPlusPad);
        engine.texture.unload(this.kBumper);
        engine.texture.unload(this.kTrigger);
        engine.texture.unload(this.kTriggerFull);
    }

    next() {
        super.next();
        // starts the next level
        let nextLevel = new BlueLevel();  // next level to be loaded
        nextLevel.start();
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0),   // position of the camera
            50,                        // width of camera
            [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mController = new engine.TextureRenderable(this.kController);
        this.mController.getXform().setSize(50, 35);
        this.mController.getXform().setPosition(0, 0);

        this.mLeftTriggerGraphic = new engine.TextureRenderable(this.kTriggerFull);
        this.mLeftTriggerGraphic.setColor([0, 0, 0, 0.8]);
        this.mLeftTriggerGraphic.getXform().setSize(-5, 8);
        this.mLeftTriggerGraphic.getXform().setPosition(-22, 13);

        this.mRightTriggerGraphic = new engine.TextureRenderable(this.kTriggerFull);
        this.mRightTriggerGraphic.setColor([0, 0, 0, 0.8]);
        this.mRightTriggerGraphic.getXform().setSize(5, 8);
        this.mRightTriggerGraphic.getXform().setPosition(22, 13);

        this.mBButton = new engine.TextureRenderable(this.kCircle);
        this.mBButton.setColor([1, 1, 1, 1]);
        this.mBButton.getXform().setSize(3.5, 3.5);
        this.mBButton.getXform().setPosition(16.1, 7.5);
        this.mButtons.push([false, this.mBButton]);

        this.mAButton = new engine.TextureRenderable(this.kCircle);
        this.mAButton.setColor([1, 1, 1, 1]);
        this.mAButton.getXform().setSize(3.5, 3.5);
        this.mAButton.getXform().setPosition(12.6, 4.25);
        this.mButtons.push([false, this.mAButton]);

        this.mXButton = new engine.TextureRenderable(this.kCircle);
        this.mXButton.setColor([1, 1, 1, 1]);
        this.mXButton.getXform().setSize(3.5, 3.5);
        this.mXButton.getXform().setPosition(9.1, 7.7);
        this.mButtons.push([false, this.mXButton]);

        this.mYButton = new engine.TextureRenderable(this.kCircle);
        this.mYButton.setColor([1, 1, 1, 1]);
        this.mYButton.getXform().setSize(3.5, 3.5);
        this.mYButton.getXform().setPosition(12.6, 11.15);
        this.mButtons.push([false, this.mYButton]);

        this.mLeftBumper = new engine.TextureRenderable(this.kBumper);
        this.mLeftBumper.setColor([1, 1, 1, 1]);
        this.mLeftBumper.getXform().setSize(9, 4);
        this.mLeftBumper.getXform().setPosition(-12.7, 15.15);
        this.mButtons.push([false, this.mLeftBumper]);

        this.mRightBumper = new engine.TextureRenderable(this.kBumper);
        this.mRightBumper.setColor([1, 1, 1, 1]);
        this.mRightBumper.getXform().setSize(-9, 4);
        this.mRightBumper.getXform().setPosition(12.6, 15.15);
        this.mButtons.push([false, this.mRightBumper]);

        this.mLeftTrigger = new engine.TextureRenderable(this.kTrigger);
        this.mLeftTrigger.setColor([1, 1, 1, 1]);
        this.mLeftTrigger.getXform().setSize(-5, 8);
        this.mLeftTrigger.getXform().setPosition(-22, 13);
        this.mButtons.push([false, this.mLeftTrigger]);

        this.mRightTrigger = new engine.TextureRenderable(this.kTrigger);
        this.mRightTrigger.setColor([1, 1, 1, 1]);
        this.mRightTrigger.getXform().setSize(5, 8);
        this.mRightTrigger.getXform().setPosition(22, 13);
        this.mButtons.push([false, this.mRightTrigger]);

        this.mBackButton = new engine.TextureRenderable(this.kCircle);
        this.mBackButton.setColor([1, 1, 1, 1]);
        this.mBackButton.getXform().setSize(2, 2);
        this.mBackButton.getXform().setPosition(-4, 7.75);
        this.mButtons.push([false, this.mBackButton]);

        this.mStartkButton = new engine.TextureRenderable(this.kCircle);
        this.mStartkButton.setColor([1, 1, 1, 1]);
        this.mStartkButton.getXform().setSize(2, 2);
        this.mStartkButton.getXform().setPosition(3.4, 7.75);
        this.mButtons.push([false, this.mStartkButton]);

        this.mLeftJoystick = new engine.TextureRenderable(this.kCircle);
        this.mLeftJoystick.setColor([1, 1, 1, 1]);
        this.mLeftJoystick.getXform().setSize(6.7, 6.7);
        this.mLeftJoystick.getXform().setPosition(-12.95, 8.12);
        this.mButtons.push([false, this.mLeftJoystick]);

        this.mRightJoystick = new engine.TextureRenderable(this.kCircle);
        this.mRightJoystick.setColor([1, 1, 1, 1]);
        this.mRightJoystick.getXform().setSize(6.7, 6.7);
        this.mRightJoystick.getXform().setPosition(6.3, 0);
        this.mButtons.push([false, this.mRightJoystick]);

        this.mUpPlusPad = new engine.TextureRenderable(this.kPlusPad);
        this.mUpPlusPad.setColor([1, 1, 1, 1]);
        this.mUpPlusPad.getXform().setSize(2, 2.25);
        this.mUpPlusPad.getXform().setPosition(-6.9, 1.8);
        this.mButtons.push([false, this.mUpPlusPad]);

        this.mDownPlusPad = new engine.TextureRenderable(this.kPlusPad);
        this.mDownPlusPad.setColor([1, 1, 1, 1]);
        this.mDownPlusPad.getXform().setSize(2, 2.25);
        this.mDownPlusPad.getXform().setPosition(-6.9, -2.7);
        this.mDownPlusPad.getXform().setRotationInDegree(180);
        this.mButtons.push([false, this.mDownPlusPad]);

        this.mLeftPlusPad = new engine.TextureRenderable(this.kPlusPad);
        this.mLeftPlusPad.setColor([1, 1, 1, 1]);
        this.mLeftPlusPad.getXform().setSize(2, 2.25);
        this.mLeftPlusPad.getXform().setPosition(-9, -0.5);
        this.mLeftPlusPad.getXform().setRotationInDegree(90);
        this.mButtons.push([false, this.mLeftPlusPad]);

        this.mDownPlusPad = new engine.TextureRenderable(this.kPlusPad);
        this.mDownPlusPad.setColor([1, 1, 1, 1]);
        this.mDownPlusPad.getXform().setSize(2, 2.25);
        this.mDownPlusPad.getXform().setPosition(-4.75, -0.5);
        this.mDownPlusPad.getXform().setRotationInDegree(270);
        this.mButtons.push([false, this.mDownPlusPad]);
        
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        this.mController.draw(this.mCamera);
        this.mLeftTriggerGraphic.draw(this.mCamera);
        this.mRightTriggerGraphic.draw(this.mCamera);

        for (let i = 0; i < this.mButtons.length; i++) {
            if (this.mButtons[i][0]) {
                this.mButtons[i][1].draw(this.mCamera);
            }
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.B)) {
            console.log("B button Clicked");
            this.mButtons[0][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.B)) {
            console.log("B button Released");
            this.mButtons[0][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.A)) {
            console.log("A button Clicked");
            this.mButtons[1][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.A)) {
            console.log("A button Released");
            this.mButtons[1][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.X)) {
            console.log("X button Clicked");
            this.mButtons[2][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.X)) {
            console.log("X button Released");
            this.mButtons[2][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Y)) {
            console.log("Y button Clicked");
            this.mButtons[3][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Y)) {
            console.log("Y button Released");
            this.mButtons[3][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftBumper)) {
            console.log("LeftBumper Clicked");
            this.mButtons[4][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftBumper)) {
            console.log("LeftBumper Released");
            this.mButtons[4][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightBumper)) {
            console.log("RightBumper Clicked");
            this.mButtons[5][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightBumper)) {
            console.log("RightBumper Released");
            this.mButtons[5][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftTrigger)) {
            console.log("LeftTrigger Clicked");
            this.mButtons[6][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftTrigger)) {
            console.log("LeftTrigger Released");
            this.mButtons[6][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightTrigger)) {
            console.log("RightTrigger Clicked");
            this.mButtons[7][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightTrigger)) {
            console.log("RightTrigger Released");
            this.mButtons[7][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Back)) {
            console.log("Back button Clicked");
            this.mButtons[8][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Back)) {
            console.log("Back button Released");
            this.mButtons[8][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.Start)) {
            console.log("Start button Clicked");
            this.mButtons[9][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.Start)) {
            console.log("Start button Released");
            this.mButtons[9][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.LeftJoystickButton)) {
            console.log("LeftJoystick button Clicked");
            this.mButtons[10][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.LeftJoystickButton)) {
            console.log("LeftJoystick button Released");
            this.mButtons[10][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.RightJoystickButton)) {
            console.log("RightJoystick button Clicked");
            this.mButtons[11][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.RightJoystickButton)) {
            console.log("RightJoystick button Released");
            this.mButtons[11][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadUp)) {
            console.log("PlusPadUp button Clicked");
            this.mButtons[12][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadUp)) {
            console.log("PlusPadUp button Released");
            this.mButtons[12][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadDown)) {
            console.log("PlusPadDown button Clicked");
            this.mButtons[13][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadDown)) {
            console.log("PlusPadDown button Released");
            this.mButtons[13][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadLeft)) {
            console.log("PlusPadLeft button Clicked");
            this.mButtons[14][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadLeft)) {
            console.log("PlusPadLeft button Released");
            this.mButtons[14][0] = false;
        }
        if (engine.input.isControllerButtonClicked(0, engine.input.buttons.PlusPadRight)) {
            console.log("PlusPadRight button Clicked");
            this.mButtons[15][0] = true;
        }
        if (engine.input.isControllerButtonReleased(0, engine.input.buttons.PlusPadRight)) {
            console.log("PlusPadRight button Released");
            this.mButtons[15][0] = false;
        }

        if (engine.input.isJoystickActive(0, engine.input.joysticks.Left)) {
            this.mButtons[10][0] = true;
            this.mButtons[10][1].getXform().setXPos(-12.95 + engine.input.getJoystickPosX(0, engine.input.joysticks.Left));
        } else {
            this.mButtons[10][0] = false;
        }
        if (engine.input.isJoystickActive(0, engine.input.joysticks.Left)) {
            this.mButtons[10][0] = true;
            this.mButtons[10][1].getXform().setYPos(8.12 + engine.input.getJoystickPosY(0, engine.input.joysticks.Left));
        } else {
            this.mButtons[10][0] = false;
        }
        if (engine.input.isJoystickActive(0, engine.input.joysticks.Right)) {
            this.mButtons[11][0] = true;
            this.mButtons[11][1].getXform().setXPos(6.3 + engine.input.getJoystickPosX(0, engine.input.joysticks.Right));
        } else {
            this.mButtons[11][0] = false;
        }
        if (engine.input.isJoystickActive(0, engine.input.joysticks.Right)) {
            this.mButtons[11][0] = true;
            this.mButtons[11][1].getXform().setYPos(0 + engine.input.getJoystickPosY(0, engine.input.joysticks.Right));
        } else {
            this.mButtons[11][0] = false;
        }
    }

}

export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}