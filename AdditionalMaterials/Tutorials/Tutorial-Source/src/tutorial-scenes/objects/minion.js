/* File: minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

"use strict";
import engine from "../../engine/index.js";

let eMinionType = Object.freeze({
    eDefault: 0,
    eSentry: 1,
    eChaser: 2
});

class Minion extends engine.GameObject {
    constructor(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h) {
        super();
        this.kDelta = 0.1;
        this.kWidth = w;
        this.kHeight = h;
        this.kSpeed = 0.03;

        this.mProjectiles = new engine.ParticleSet();
        this.mType = type;

        // control of movement
        this.mInitialPosition = vec2.fromValues(atX, atY);
        this.mMovementRange = movementRange;

        if (normal === null) {
            this.mMinion = new engine.LightRenderable(texture);
        } else {
            this.mMinion = new engine.IllumRenderable(texture, normal);
        }
        this.mRenderComponent = this.mMinion;

        this.light = this._createPointLight(atX, atY);
        lightSet.addToSet(this.light);

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mMinion.addLight(lightSet.getLightAt(i));
        }
        this.changeSprite(atX, atY);

        let rigidShape = new engine.RigidRectangle(this.getXform(), this.kWidth, this.kHeight);
        rigidShape.setMass(1);  
        rigidShape.toggleDrawBound();
        rigidShape.setAcceleration(0, 0);
        rigidShape.setInertia(0);
        this.setRigidBody(rigidShape);

        // velocity and movementRange will come later
        let size = vec2.length(velocity);
        if (size > 0.001) {
            this.setCurrentFrontDir(velocity);
            vec2.scale(velocity, velocity, this.kSpeed);
            rigidShape.setVelocity(velocity[0], velocity[1]);
        }
    }


    // Orientate the entire object to point towards point p
    // will rotate Xform() accordingly
    rotateObjPointTo(p, rate) {
        // Step A: determine if reached the destination position p
        let dir = [];
        vec2.sub(dir, p, this.getXform().getPosition());
        let len = vec2.length(dir);
        if (len < Number.MIN_VALUE) {
            return; // we are there.
        }
        vec2.scale(dir, dir, 1 / len);

        // Step B: compute the angle to rotate
        let fdir = this.getCurrentFrontDir();
        let cosTheta = vec2.dot(dir, fdir);

        if (cosTheta > 0.999999) { // almost exactly the same direction
            return;
        }

        // Step C: clamp the cosTheta to -1 to 1 
        // in a perfect world, this would never happen! BUT ...
        if (cosTheta > 1) {
            cosTheta = 1;
        } else {
            if (cosTheta < -1) {
                cosTheta = -1;
            }
        }

        // Step D: compute whether to rotate clockwise, or counterclockwise
        let dir3d = vec3.fromValues(dir[0], dir[1], 0);
        let f3d = vec3.fromValues(fdir[0], fdir[1], 0);
        let r3d = [];
        vec3.cross(r3d, f3d, dir3d);

        let rad = Math.acos(cosTheta);  // radian to roate
        if (r3d[2] < 0) {
            rad = -rad;
        }

        // Step E: rotate the facing direction with the angle and rate
        rad *= rate;  // actual angle need to rotate from Obj's front
        vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
        this.getXform().incRotationByRad(rad);
    }

    update() {
        // remember to update this.mMinion's animation
        this.mMinion.updateAnimation();
        this.mProjectiles.update();
        // super.update(); do not need to do rigidshape update!

        let p = this.getXform().getPosition();
        vec2.add(p, p, this.getRigidBody().getVelocity());

        if (this.mType === eMinionType.eDefault || this.mType === eMinionType.eSentry) {
            let s = vec2.fromValues(0, 0);
            vec2.subtract(s, p, this.mInitialPosition);
            let len = vec2.length(s);
            if (len > this.mMovementRange) {
                this.getRigidBody().flipVelocity();
            }
            this.light.set2DPosition(this.getXform().getPosition());
        }
    }

    draw(aCamera) {
        super.draw(aCamera);
        this.mProjectiles.draw(aCamera);
    }

    changeSprite(atX, atY) {
        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(this.kWidth, this.kHeight);
        this.mMinion.getXform().setZPos(2);

        switch (this.mType) {
            case eMinionType.eDefault:
                this.mMinion.setSpriteSequence(512, 0, 204, 164, 5, 0);
                this.mMinion.setAnimationType(engine.eAnimationType.eSwing);
                this.mMinion.setAnimationSpeed(20);
                break;
            case eMinionType.eSentry:
                this.mMinion.setSpriteSequence(164, 308, 204, 164, 1, 0);
                this.mMinion.setAnimationSpeed(1);
                break;
            case eMinionType.eChaser:
                this.mMinion.setSpriteSequence(164, 608, 90, 164, 1, 0);
                this.mMinion.setAnimationSpeed(1);
                break;
        }
    }

    _createPointLight(atX, atY) {
        let lgt = new engine.Light();
        lgt.setLightType(0);
        lgt.setColor([1, 1, 1, 1]);
        lgt.setXPos(atX);
        lgt.setYPos(atY);
        lgt.setZPos(1);
        lgt.setNear(1);
        lgt.setFar(2);
        lgt.setIntensity(1);
        lgt.setDropOff(20);
        lgt.setLightCastShadowTo(true);
        return lgt;
    }

    getProjectiles() {
        return this.mProjectiles
    }
}

export default Minion;