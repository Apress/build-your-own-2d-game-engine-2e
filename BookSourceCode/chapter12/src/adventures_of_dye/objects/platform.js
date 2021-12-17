/* File: Platform.js 
 *
 * Creates and initializes a Platform
 */

"use strict";
import engine from "../../engine/index.js";

class Platform extends engine.GameObject {
    constructor(cx, cy, velocity, movementRange, texture, normal, lightSet) {
        super(null);
        this.kPlatformWidth = 10;
        this.kPlatformHeight = this.kPlatformWidth / 12;
        this.kSpeed = 0.05;

        // control of movement
        this.mInitialPosition = vec2.fromValues(cx, cy);
        this.mMovementRange = movementRange;

        this.mRenderComponent = new engine.IllumRenderable(texture, normal);
        let i;
        for (i = 0; i < lightSet.numLights(); i++) {
            this.mRenderComponent.addLight(lightSet.getLightAt(i));
        }
        this.getXform().setSize(this.kPlatformWidth, this.kPlatformHeight);
        this.getXform().setPosition(cx, cy);

        let rigidShape = new engine.RigidRectangle(this.getXform(), this.kPlatformWidth, this.kPlatformHeight);
        rigidShape.setMass(0);  // ensures no movements!
        this.setRigidBody(rigidShape);
        this.toggleDrawRigidShape();

        // velocity and movementRange will come later
        let size = vec2.length(velocity);
        if (size > 0.001) {
            this.setCurrentFrontDir(velocity);
            vec2.scale(velocity, velocity, this.kSpeed);
            rigidShape.setVelocity(velocity[0], velocity[1]);
        }
    }

    update() {
        super.update();
        let p = this.getXform().getPosition();
        vec2.add(p, p, this.getRigidBody().getVelocity());
        let s = vec2.fromValues(0, 0);
        vec2.subtract(s, p, this.mInitialPosition);
        let len = vec2.length(s);
        if (len > this.mMovementRange) {
            this.getRigidBody().flipVelocity();
        }
    }
}

export default Platform;