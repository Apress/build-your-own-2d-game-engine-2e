"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kRefWidth = 80;
        this.kRefHeight = 130;
        this.kDelta = 0.5;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
    }

    update() {
        let xform = this.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(this.kDelta);
        }

        if (this.isVisible()) {
            xform.incYPosBy(-this.kDelta);
        }
    }
}

export default DyePack;