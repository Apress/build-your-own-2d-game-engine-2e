"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Player extends engine.GameObject {
    constructor(texture, pos, playerNum, playerColor, isVertical) {
        super(null);

        this.enabled = true;
        this.playerNum = playerNum;
        this.score = 0;
        this.pos = pos;
        this.textOffset = [];

        switch(playerNum) {
            case 0:
                this.textOffset = [-5, 10];
                break;
            case 1:
                this.textOffset = [-5, -10];
                break;
            case 2:
                this.textOffset = [-15,  0];
                break;
            case 3:
                this.textOffset = [10, 0];
                break;
            default:
                break;
        }

        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor(playerColor);
        this.mRenderComponent.getXform().setPosition(pos[0], pos[1]);

        this.mText = new engine.FontRenderable("P" + (playerNum + 1) + ": " + this.score);
        this.mText.setColor(playerColor);
        this.mText.setTextHeight(3.5);
        this.mText.getXform().setPosition(this.pos[0] + this.textOffset[0], this.pos[1] + this.textOffset[1]);

        this.bb = null;
        this.width = 0;
        this.height = 0;

        this.playerColor = playerColor
        this.vertical = isVertical;

        this.lastXMovement = 0;
        this.lastYMovement = 0;

        if (isVertical) {
            this.width = 5;
            this.height = 25;

        } else {
            this.width = 25;
            this.height = 5;
            
        }

        this.mRenderComponent.getXform().setSize(this.width, this.height);

        this.bb = new engine.BoundingBox(
            [pos[0], pos[1]],
            this.width,
            this.height
        );
        
        this.setVisibility(true);
    }

    update() {
        if (this.enabled) {
            let xform = this.getXform();
            let delta = 0;
            switch(this.playerNum) {
                case 0:
                    // console.log("player 0 update");
                    if (engine.input.isJoystickActive(this.playerNum, engine.input.joysticks.Left)) {
                        delta = engine.input.getJoystickPosX(this.playerNum, engine.input.joysticks.Left);
                        xform.incXPosBy(delta);
                        this.mText.getXform().incXPosBy(delta);
                        this.bb.setBounds(
                            [xform.getXPos(), xform.getYPos()],
                            this.width,
                            this.height
                        );
                    }
                    this.checkXBounds(xform, 50, -50, 12.5);
                    this.lastXMovement = delta;
                    break;
                case 1:
                    // console.log("player 1 update");
                    if (engine.input.isJoystickActive(this.playerNum, engine.input.joysticks.Left)) {
                        delta = engine.input.getJoystickPosX(this.playerNum, engine.input.joysticks.Left);
                        xform.incXPosBy(delta);
                        this.mText.getXform().incXPosBy(delta);
                        this.bb.setBounds(
                            [xform.getXPos(), xform.getYPos()],
                            this.width,
                            this.height
                        );
                    }
                    this.checkXBounds(xform, 50, -50, 12.5);
                    this.lastXMovement = delta;
                    break;
                case 2:
                    if (engine.input.isJoystickActive(this.playerNum, engine.input.joysticks.Left)) {
                        delta = engine.input.getJoystickPosY(this.playerNum, engine.input.joysticks.Left);
                        xform.incYPosBy(delta);
                        this.mText.getXform().incYPosBy(delta);
                        this.bb.setBounds(
                            [xform.getXPos(), xform.getYPos()],
                            this.width,
                            this.height
                        );
                    }
                    this.checkYBounds(xform, 50, -50, 12.5);
                    this.lastYMovement = delta;
                    break;
                case 3:
                    if (engine.input.isJoystickActive(this.playerNum, engine.input.joysticks.Left)) {
                        delta = engine.input.getJoystickPosY(this.playerNum, engine.input.joysticks.Left);
                        xform.incYPosBy(delta);
                        this.mText.getXform().incYPosBy(delta);
                        this.bb.setBounds(
                            [xform.getXPos(), xform.getYPos()],
                            this.width,
                            this.height
                        );
                    }
                    this.checkYBounds(xform, 50, -50, 12.5);
                    this.lastYMovement = delta;
                    break;
                default:
                    // do nothing
                    break;
            }
        }
    }

    checkXBounds(xform, upper, lower, padding) {
        if (xform.getXPos() + padding > upper) {
            xform.setXPos(upper - padding);
        }
        if (xform.getXPos() - padding < lower) {
            xform.setXPos(lower + padding);
        }
        this.bb.setBounds(
            [xform.getXPos(), xform.getYPos()],
            this.width,
            this.height
        );
        this.mText.getXform().setPosition(
            xform.getXPos() + this.textOffset[0],
            xform.getYPos() + this.textOffset[1]
        );
    }
    checkYBounds(xform, upper, lower, padding) {
        if (xform.getYPos() + padding > upper) {
            xform.setYPos(upper - padding);
        }
        if (xform.getYPos() - padding < lower) {
            xform.setYPos(lower + padding);
        }
        this.bb.setBounds(
            [xform.getXPos(), xform.getYPos()],
            this.width,
            this.height
        );
        this.mText.getXform().setPosition(
            xform.getXPos() + this.textOffset[0],
            xform.getYPos() + this.textOffset[1]
        );
    }

    draw(camera) {
        if (this.enabled) {
            super.draw(camera);
            this.mText.draw(camera); 
        }
        
    }

    reset() {
        this.mRenderComponent.getXform().setPosition(this.pos[0], this.pos[1]);
        this.bb.setBounds(
            [this.pos[0], this.pos[1]],
            this.width,
            this.height
        )
        this.mText.getXform().setPosition(this.pos[0] + this.textOffset[0], this.pos[1] + this.textOffset[1]);
        this.score = 0;
        this.mText.setText("P" + (this.playerNum + 1) + ": " + this.score);
    }

    getPlayerNum() {
        return this.playerNum;
    }

    isEnabled() {

    }

    setEnabled(isEnabled) {
        if (isEnabled && !this.enabled) {
            this.enabled = true;
            this.getXform().setPosition(this.pos[0], this.pos[1]);
        }
        if (!isEnabled && this.enabled) {
            this.enabled = false;
            this.getXform().setPosition(200, 200);
        }
    }

    getBB() {
        return this.bb;
    }

    isVertical() {
        return this.vertical;
    }

    getXMovement() {
        return this.lastXMovement;
    }

    getYMovement() {
        return this.lastYMovement
    }

    scoreGoal() {
        this.score++;
        this.mText.setText("P" + (this.playerNum + 1) + ": " + this.score);
    }
}

export default Player;