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

class Minion extends WASDObj {
    constructor(spriteTexture, atX, atY, createCircle, size) {
        super(null);
        let w = kMinionWidth + size;
        let h = kMinionHeight + size;

        this.mRenderComponent = new engine.TextureRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(w, h);
        if (createCircle === 1) {
            this.mRenderComponent.getXform().setSize(h, h);
        }

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
        // this.toggleDrawRigidShape();
    }

    update() {
        engine.GameObject.prototype.update.call(this);
    }
}

export default Minion;