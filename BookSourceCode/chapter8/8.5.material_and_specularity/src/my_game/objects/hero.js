/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture, normalMap) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.IllumRenderable(spriteTexture, normalMap);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(15, 50);
        this.mRenderComponent.getXform().setSize(18, 24);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
    }

    update() {
        // control by WASD
        let xform = this.getXform();
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
}

export default Hero;