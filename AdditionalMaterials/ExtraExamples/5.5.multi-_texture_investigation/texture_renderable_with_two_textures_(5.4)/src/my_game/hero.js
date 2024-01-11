"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class Hero {
    constructor(spriteTexture, atX, atY) {
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(4.5, 6);
    }

    update() {
        // control by WASD
        let xform = this.mRenderComponent.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incXPosBy(this.kDelta);
        }
    }
    
    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }
}

export default Hero;