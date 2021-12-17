"use strict";  // Operate in Strict mode such that variables must be declared before used!
import engine from "../../engine/index.js";

class Door extends engine.GameObject {
    constructor(cx, cy, texture0, texture1, texture2, lightSet) {
        super(null);
        this.kWidth = 1.2;
        this.kHeight = 3;
        this.kSpeed = 0.05;

        // control of movement
        this.mTopInitialYPosition = 0;
        this.mBotInitialYPosition = 0;
        this.mIsOpen = false;

        this.mDoorTop = new engine.LightRenderable(texture0);
        this.mDoorBot = new engine.LightRenderable(texture1);
        this.mDoorTopSleeve = new engine.LightRenderable(texture2);
        this.mDoorBotSleeve = new engine.LightRenderable(texture2);

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mDoorTop.addLight(lightSet.getLightAt(i));
            this.mDoorBot.addLight(lightSet.getLightAt(i));
            this.mDoorTopSleeve.addLight(lightSet.getLightAt(i));
            this.mDoorBotSleeve.addLight(lightSet.getLightAt(i));
        }

        this.buildSprite(cx, cy);
        this.mRenderComponent = this.mDoorTop;


        let rigidShape = new engine.RigidRectangle(this.getXform(), this.kWidth, this.kHeight * 2);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.toggleDrawBound();
        this.setRigidBody(rigidShape);
    }

    update() {
        super.update();
        if (this.mIsOpen) {
            this._openDoor();
        }
    }

    draw(aCamera) {
        super.draw(aCamera);
        this.mDoorTop.draw(aCamera);
        this.mDoorBot.draw(aCamera);
        this.mDoorTopSleeve.draw(aCamera);
        this.mDoorBotSleeve.draw(aCamera);
    }

    buildSprite(atX, atY) {
        this.mTopInitialYPosition = atY + 1.3;
        this.mDoorTop.getXform().setPosition(atX, this.mTopInitialYPosition);
        this.mDoorTop.getXform().setSize(this.kWidth, this.kHeight);
        this.mDoorTop.getXform().setZPos(2);
        this.mDoorTop.setElementPixelPositions(0, 64, 0, 128);

        this.mBotInitialYPosition = atY - 1.3;
        this.mDoorBot.getXform().setPosition(atX, this.mBotInitialYPosition);
        this.mDoorBot.getXform().setSize(this.kWidth, this.kHeight);
        this.mDoorBot.getXform().setZPos(2);
        this.mDoorBot.setElementPixelPositions(0, 64, 0, 128);

        this.mDoorTopSleeve.getXform().setPosition(atX, atY + 2.5);
        this.mDoorTopSleeve.getXform().setSize(this.kWidth + 1, this.kHeight + 2);
        this.mDoorTopSleeve.getXform().setZPos(2);
        this.mDoorTopSleeve.setElementPixelPositions(0, 128, 212, 512);

        this.mDoorBotSleeve.getXform().setPosition(atX, atY - 2.5);
        this.mDoorBotSleeve.getXform().setSize(this.kWidth + 1, this.kHeight + 2);
        this.mDoorBotSleeve.getXform().setZPos(2);
        this.mDoorBotSleeve.setElementPixelPositions(0, 128, 0, 300);
    }

    _openDoor() {
        let topY = this.mDoorTop.getXform().getYPos();
        let botY = this.mDoorBot.getXform().getYPos();

        if (Math.abs(this.mTopInitialYPosition - topY) <= this.kHeight
            || Math.abs(this.mBotInitialYPosition - botY) <= this.kHeight) {
            this.mDoorTop.getXform().setYPos(topY + 0.01);
            this.mDoorTop.setElementPixelPositions(64, 128, 0, 128);

            this.mDoorBot.getXform().setYPos(botY - 0.01);
            this.mDoorBot.setElementPixelPositions(64, 128, 0, 128);

            this.mDoorTopSleeve.setElementPixelPositions(128, 256, 212, 512);
            this.mDoorBotSleeve.setElementPixelPositions(128, 256, 0, 300);
        }
    }

    unlockDoor() {
        this.mIsOpen = true;
    }

}

export default Door;