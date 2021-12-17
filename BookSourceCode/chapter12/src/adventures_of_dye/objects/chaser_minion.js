"use strict";

import Minion from "./minion.js";

class ChaserMinion extends Minion {
    constructor(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h) {
        super(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h);
        this.kOffset = 4.7;
        this.kShootTimer = 90;
        this.kSpeed = 1;
        vec2.scale(velocity, velocity, this.kSpeed);
        this.mSpeed = vec2.length(velocity);
        this.setCurrentFrontDir(velocity);
        this.getRigidBody().setVelocity(velocity[0], velocity[1]);
    }

    update(target) {
        super.update(target);
        let v = this.getRigidBody().getVelocity();
        vec2.scale(v, this.getCurrentFrontDir(), this.mSpeed);

        let p = target.getXform().getPosition();
        this.rotateObjPointTo(p, 0.08);
    }
}

export default ChaserMinion;