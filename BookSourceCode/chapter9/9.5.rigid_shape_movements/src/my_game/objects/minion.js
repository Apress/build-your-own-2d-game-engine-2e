/* File: minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import WASDObj from "./wasd_obj.js";

let kMinionWidth = 6 * 0.5;
let kMinionHeight = 4.8 * 0.5;
let kMinionRandomSize = 5;

class Minion extends WASDObj {
    constructor(spriteTexture, atX, atY, createCircle) {
        super();
        let w = kMinionWidth + Math.random() * kMinionRandomSize;
        let h = kMinionHeight + Math.random() * kMinionRandomSize;

        this.mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(w, h);
        this.mRenderComponent.getXform().setRotationInDegree((Math.random() - 0.5) * 70);
        this.mRenderComponent.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mRenderComponent.setAnimationType(engine.eAnimationType.eSwing);
        this.mRenderComponent.setAnimationSpeed(30);
        // show each element for mAnimSpeed updates


        let r;
        if (createCircle)
            r = new engine.RigidCircle(this.getXform(), 0.35 * Math.sqrt(w * w + h * h));
        else
            r = new engine.RigidRectangle(this.getXform(), w, h);
        let vx = (Math.random() - 0.5);
        let vy = (Math.random() - 0.5);
        let speed = 20 + Math.random() * 10;
        r.setVelocity(vx * speed, vy * speed);
        this.setRigidBody(r);
        this.toggleDrawRenderable();
        this.toggleDrawRigidShape();
    }


    update(aCamera) {
        super.update();
        // remember to update renderable's animation
        this.mRenderComponent.updateAnimation();
    }
}

export default Minion;