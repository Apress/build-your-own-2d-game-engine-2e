
/* 
 * File: rigid_shape.js
 *      base class for objects to participate in physics system
 */
"use strict";

import * as debugDraw from "../core/debug_draw.js";

let kShapeColor = [0, 1, 0, 1];
let kBoundColor = [1, 1, 1, 1];

import * as physics from "../components/physics.js";
import * as input from "../components/input.js";
import * as loop from "../core/loop.js";

let kRigidShapeUIDelta = 0.01;   // for UI interactive debugging
let kPrintPrecision = 2;         // for printing float precision

class RigidShape {
    /**
     * @classdesc Base class for objects to participate in physics system, extended by RigidCircles and RigidRectangles. 
     * Used to control the Transform of another object
     * <p>Found in Chapter 9, page 534 of the textbook</p>
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.1.rigid_shapes_and_bounds/index.html 9.1 Rigid Shape and Bounds},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.6.collision_position_correction/index.html 9.6 Collision Position Correction},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.9.physics_presets/index.html 9.9 Physics Presets}
     * 
     * @constructor
     * @param {Transform} xf - the Transform for this RigidShape
     * @returns {RigidShape} a new RigidShape instance
     */
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
    /**
     * Returns what subtype this RigidShape belongs to
     * @method
     * @returns {string} mType - whether this is a RigidCircle or RigidRectangle
     */
    getType() { return this.mType; }

    /**
     * Returns the inverse mass of this RigidShape
     * @method
     * @returns {float} mInvMass - the inverse mass
     */
    getInvMass() { return this.mInvMass; }

    /**
     * Sets the mass of this RigidShape
     * @method
     * @param {float} m - the new mass
     */
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
    /**
     * Returns the inertia of this RigidShape
     * @method
     * @returns {float} mInertia - the inertia
     */
    getInertia() { return this.mInertia; }
    /**
     * Sets the inertia of this RigidShape
     * @method
     * @param {float} i - the new inertia
     */
    setInertia(i) { this.mInertia = i; }

    /**
     * Returns the friction for this RigidShape
     * @method
     * @returns {float} mFriction - the friction
     */
    getFriction() { return this.mFriction; }
    /**
     * Sets the friction for this RigidShape
     * @method
     * @param {float} f - the new friction
     */
    setFriction(f) { this.mFriction = f; }

    /**
     * Returns the restitution for this RigidShape
     * @method
     * @returns {float} mRestitution - the restitution
     */
    getRestitution() { return this.mRestitution; }
    /**
     * Sets the restitution for this RigidShape
     * @param {float} r - the new restitution 
     */
    setRestitution(r) { this.mRestitution = r; }

    /**
     * Returns the angular velocity of this RigidShape
     * @method
     * @returns {float} mAngularVelocity - the angular velocity
     */
    getAngularVelocity() { return this.mAngularVelocity; }
    /**
     * Sets the angular velocity for this RigidShape
     * @method
     * @param {float} w - the new angular velocity 
     */
    setAngularVelocity(w) { this.mAngularVelocity = w; }
    /**
     * Adds a value to the current angular velocity for this RigidShape
     * @method
     * @param {float} dw - value to add
     */
    setAngularVelocityDelta(dw) { this.mAngularVelocity += dw; }

    /**
     * Returns the world coordinates of the center of this RigidShape
     * @method
     * @returns {vec2} [X,Y] center point
     */
    getCenter() { return this.mXform.getPosition(); }

    /**
     * Returns the radius of the bounds for this RigidShape
     * @method
     * @returns {float} mBoundRadius - the bounding radius
     */
    getBoundRadius() { return this.mBoundRadius; }
    
    /**
     * Toggle whether the bounds of this RigidShape are drawn
     * @method
     */
    toggleDrawBound() { this.mDrawBounds = !this.mDrawBounds; }
    /**
     * Sets the bound radius of this RigidShape
     * @method
     * @param {float} r - the new bound radius 
     */
    setBoundRadius(r) { this.mBoundRadius = r; }

    /**
     * Returns the velocity vector of this RigidShape
     * @returns {vec2} mVelocity - [X,Y] velocity vector
     */
    getVelocity() { return this.mVelocity; }

    /**
     * Set the velocity vector of this RigidShape
     * @param {float} x - horizontal world coordinate velocity
     * @param {float} y - vertical world coordinate velocity
     */
    setVelocity(x, y) {
        this.mVelocity[0] = x;
        this.mVelocity[1] = y;
    }

    /**
     * Reverse the direction of the velocity vector of this RigidShape
     * @method
     */
    flipVelocity() {
        this.mVelocity[0] = -this.mVelocity[0];
        this.mVelocity[1] = -this.mVelocity[1];
    }
    /**
     * Returns the world coordinate acceleration vector of this RigidShape
     * @method
     * @returns {vec2} mAcceleration - the acceleration vector
     */
    getAcceleration() { return this.mAcceleration; }

    /**
     * Sets the world coordinate acceleration vector of this RigidShape
     * @method
     * @param {float} x - horizontal acceleration
     * @param {float} y - vertical acceleration
     */
    setAcceleration(x, y) {
        this.mAcceleration[0] = x;
        this.mAcceleration[1] = y;
    }
    
    /**
     * Set the Transform for this RigidShape
     * @method
     * @param {Transform} xf - the Transform
     */
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

    /**
     * Set the world coordinate position of this RigidShape
     * @method
     * @param {float} x - horizontal position
     * @param {float} y - vertical position
     */
    setPosition(x, y) {
        this.mXform.setPosition(x, y);
    }

    /**
     * Adjust the position of this RigidShape by moving the position a distance along a specified vector
     * @method
     * @param {vec2} v - the [X,Y] direction vector
     * @param {float} delta - the distance to move
     */
    adjustPositionBy(v, delta) {
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, v, delta);
    }

    /**
     * Update this RigidShape changing the position, velocity, and rotation if 
     * physics motion is enabled and the RigidShape has mass
     * @method
     */
    update() {
        if (this.mInvMass === 0)
            return;

        if (physics.getHasMotion())
            this.travel();
    }

    /**
     * Test if this RigidShape is overlapping with another RigidShape
     * @param {RigidShape} otherShape - the other RigidShape
     * @returns {boolean} true if the two shapes overlap
     */
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
    /**
     * Draws this RigidShape to aCamera if bound drawing is enabled
     * @param {Camera} aCamera - the Camera to draw to
     */
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
    /**
     * Returns a string containing the mass, inertia, friction, and restitution of this RigidShape
     * @returns {string} - the information string
     */
    getCurrentState() {
        let m = this.mInvMass;
        if (m !== 0)
            m = 1 / m;

        return "M=" + m.toFixed(kPrintPrecision) +
            "(I=" + this.mInertia.toFixed(kPrintPrecision) + ")" +
            " F=" + this.mFriction.toFixed(kPrintPrecision) +
            " R=" + this.mRestitution.toFixed(kPrintPrecision);
    }
    
    /**
     * Based on keyboard input raise or lower the mass, friction, or restitution of this RigidShape
     * @method
     */
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