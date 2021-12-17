"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Brain extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDeltaDegree = 1;
        this.kDeltaRad = Math.PI * this.kDeltaDegree / 180;
        this.kDeltaSpeed = 0.01;
        this.mRenderComponent =  new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(50, 10);
        this.mRenderComponent.getXform().setSize(3, 5.4);
        this.mRenderComponent.setElementPixelPositions(600, 700, 0, 180);

        this.setSpeed(0.3);
    }

    update() {
        GameObject.update();
        let xf = this.getXform();
        let fdir = this.getCurrentFrontDir();
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xf.incRotationByDegree(this.kDeltaDegree);
            vec2.rotate(fdir, fdir, this.kDeltaRad);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xf.incRotationByRad(-this.kDeltaRad);
            vec2.rotate(fdir, fdir, -this.kDeltaRad);
        }
        if (engine.input.isKeyClicked(engine.input.keys.Up)) {
            this.incSpeedBy(this.kDeltaSpeed);
        }
        if (engine.input.isKeyClicked(engine.input.keys.Down)) {
            this.incSpeedBy(-this.kDeltaSpeed);
        }
    }
}

export default Brain;