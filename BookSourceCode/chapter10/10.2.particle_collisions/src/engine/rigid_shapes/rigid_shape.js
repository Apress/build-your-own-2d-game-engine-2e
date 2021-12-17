
/* 
 * File: rigid_shape.js
 *      base class for objects to participate in physics system
 */
"use strict";

import * as debugDraw from "../core/debug_draw.js";

let kShapeColor = [0, 0, 0, 1];
let kBoundColor = [1, 1, 1, 1];

import * as physics from "../components/physics.js";
import * as input from "../components/input.js";
import * as loop from "../core/loop.js";

let kRigidShapeUIDelta = 0.01;   // for UI interactive debugging
let kPrintPrecision = 2;         // for printing float precision

class RigidShape {
    constructor(xf) {
        this.mXform = xf;
        this.mAcceleration = physics.getSystemAcceleration();
        this.mVelocity = vec2.fromValues(0, 0);
        this.mType = "";

        this.mInvMass = 1;
        this.mInertia = 0;

        this.mFriction = 0.8;
        this.mRestitution = 0.2;

        this.mAngularVelocity = 0;

        this.mBoundRadius = 0;

        this.mDrawBounds = false;
    }

    // #region getters and setters
    getType() { return this.mType; }

    getInvMass() { return this.mInvMass; }
    setMass(m) {
        if (m > 0) {
            this.mInvMass = 1 / m;
            this.mAcceleration = physics.getSystemAcceleration();
        } else {
            this.mInvMass = 0;
            this.mAcceleration = [0, 0];  // to ensure object does not move
        }
        this.updateInertia();
    }

    getInertia() { return this.mInertia; }
    setInertia(i) { this.mInertia = i; }

    getFriction() { return this.mFriction; }
    setFriction(f) { this.mFriction = f; }

    getRestitution() { return this.mRestitution; }
    setRestitution(r) { this.mRestitution = r; }

    getAngularVelocity() { return this.mAngularVelocity; }
    setAngularVelocity(w) { this.mAngularVelocity = w; }
    setAngularVelocityDelta(dw) { this.mAngularVelocity += dw; }

    getCenter() { return this.mXform.getPosition(); }
    getBoundRadius() { return this.mBoundRadius; }
    
    toggleDrawBound() { this.mDrawBounds = !this.mDrawBounds; }
    setBoundRadius(r) { this.mBoundRadius = r; }

    getVelocity() { return this.mVelocity; }
    setVelocity(x, y) {
        this.mVelocity[0] = x;
        this.mVelocity[1] = y;
    }
    flipVelocity() {
        this.mVelocity[0] = -this.mVelocity[0];
        this.mVelocity[1] = -this.mVelocity[1];
    }
        
    getAcceleration() { return this.mAcceleration; }
    setAcceleration(x, y) {
        this.mAcceleration[0] = x;
        this.mAcceleration[1] = y;
    }
    
    setTransform(xf) { this.mXform = xf; }
    // #endregion

    travel() {
        let dt = loop.getUpdateIntervalInSeconds();

        // update velocity by acceleration
        vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);

        // p  = p + v*dt  with new velocity
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, this.mVelocity, dt);

        this.mXform.incRotationByRad(this.mAngularVelocity * dt);
    }

    setPosition(x, y) {
        this.mXform.setPosition(x, y);
    }
    adjustPositionBy(v, delta) {
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, v, delta);
    }

    update() {
        if (this.mInvMass === 0)
            return;

        if (physics.getHasMotion())
            this.travel();
    }

    boundTest(otherShape) {
        let vFrom1to2 = [0, 0];
        vec2.subtract(vFrom1to2, otherShape.mXform.getPosition(), this.mXform.getPosition());
        let rSum = this.mBoundRadius + otherShape.mBoundRadius;
        let dist = vec2.length(vFrom1to2);
        if (dist > rSum) {
            // not overlapping
            return false;
        }
        return true;
    }

    // #region drawing as line and circle
    draw(aCamera) {
        if (!this.mDrawBounds)
            return;
        debugDraw.drawCircle(aCamera, this.mXform.getPosition(), this.mBoundRadius, this._boundColor());
        debugDraw.drawCrossMarker(aCamera, this.mXform.getPosition(), 
                                  this.mBoundRadius * 0.2, this._boundColor());
    }

    _shapeColor() { return kShapeColor; }
    _boundColor() { return kBoundColor; }
    // #endregion 

    // #region support interactive debugging and state querying
    getCurrentState() {
        let m = this.mInvMass;
        if (m !== 0)
            m = 1 / m;

        return "M=" + m.toFixed(kPrintPrecision) +
            "(I=" + this.mInertia.toFixed(kPrintPrecision) + ")" +
            " F=" + this.mFriction.toFixed(kPrintPrecision) +
            " R=" + this.mRestitution.toFixed(kPrintPrecision);
    }

    userSetsState() {
        // keyboard control
        let delta = 0;

        if (input.isKeyPressed(input.keys.Up)) {
            delta = kRigidShapeUIDelta;
        }
        if (input.isKeyPressed(input.keys.Down)) {
            delta = -kRigidShapeUIDelta;
        }
        if (delta !== 0) {
            if (input.isKeyPressed(input.keys.M)) {
                let m = 0;
                if (this.mInvMass > 0)
                    m = 1 / this.mInvMass;
                this.setMass(m + delta * 10);
            }
            if (input.isKeyPressed(input.keys.F)) {
                this.mFriction += delta;
                if (this.mFriction < 0)
                    this.mFriction = 0;
                if (this.mFriction > 1)
                    this.mFriction = 1;
            }
            if (input.isKeyPressed(input.keys.N)) {
                this.mRestitution += delta;
                if (this.mRestitution < 0)
                    this.mRestitution = 0;
                if (this.mRestitution > 1)
                    this.mRestitution = 1;
            }
        }
    }
    // #endregion
}

export default RigidShape;