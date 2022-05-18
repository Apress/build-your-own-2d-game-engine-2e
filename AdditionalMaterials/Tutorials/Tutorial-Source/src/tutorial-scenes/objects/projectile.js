"use strict";
import engine from "../../engine/index.js";

const kTexture = "assets/EMPPulse.png";
const kSpeed = 0.2;

class Projectile extends engine.Particle {
    constructor(atX, atY, velocity, radius) {
        super(kTexture, atX, atY, 500);
        vec2.scale(velocity, velocity, kSpeed);
        this.setVelocity(velocity[0], velocity[1]);
        this.setAcceleration(-30, 0);
        this.setColor([1, 1, 1, 1]);
        this.setSize(radius, radius);
        this.setSizeDelta(1);
    }
}

export default Projectile;