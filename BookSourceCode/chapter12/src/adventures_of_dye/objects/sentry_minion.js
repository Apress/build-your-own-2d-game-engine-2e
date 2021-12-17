"use strict";

import engine from "../../engine/index.js";

import Minion from "./minion.js";
import Projectile from "./projectile.js";

class SentryMinion extends Minion {
    constructor(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h) {
        super(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h);
        this.kOffset = 4.7;
        this.kShootTimer = 90;

        this.mNumCycles = 0;
        this.mSpotlight = this._createSpotLight(atX, atY, velocity);
        lightSet.addToSet(this.mSpotlight);
    }

    update() {
        super.update();
        let b;
        this.mNumCycles++;
        if (this.mNumCycles > this.kShootTimer) {
            this.mNumCycles = 0;
            b = new Projectile(this.getXform().getXPos() - 0.5, this.getXform().getYPos(), [-1, 0], 0.75);
            this.mProjectiles.addToSet(b);
        }

        let p = [0, 0];
        p[0] = this.getXform().getXPos() + this.kOffset;
        p[1] = this.getXform().getYPos();
        this.mSpotlight.set2DPosition(p);
    }

    _createSpotLight(atX, atY, velocity) {
        let lgt = new engine.Light();
        lgt.setLightType(2);
        lgt.setColor([1, 1, 1, 1]);
        lgt.setXPos(atX - this.kOffset);
        lgt.setYPos(atY);
        lgt.setZPos(0.7);
        lgt.setDirection([-1, 0, -2]);
        lgt.setNear(15);
        lgt.setFar(20);
        lgt.setInner(0.1);
        lgt.setOuter(0.2);
        lgt.setIntensity(15);
        lgt.setDropOff(2);
        lgt.setLightCastShadowTo(true);
        return lgt;
    }

}

export default SentryMinion;