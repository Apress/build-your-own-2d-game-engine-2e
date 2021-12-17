/*
 * File: game_object.js
 *
 * defines the behavior and appearance of a game object
 * 
 */
"use strict";
import BoundingBox from "../utils/bounding_box.js";

class GameObject {
    constructor(renderable) {
        this.mRenderComponent = renderable;
        this.mVisible = true;
        this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
        this.mRigidBody = null;
        this.mDrawRenderable = true;
        this.mDrawRigidShape = false;
    }

    getXform() { return this.mRenderComponent.getXform(); }
    getBBox() {
        let xform = this.getXform();
        let b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
        return b;
    }
    setVisibility(f) { this.mVisible = f; }
    isVisible() { return this.mVisible; }

    setCurrentFrontDir(f) { vec2.normalize(this.mCurrentFrontDir, f); }
    getCurrentFrontDir() { return this.mCurrentFrontDir; }

    getRenderable() { return this.mRenderComponent; }

    setRigidBody(r) { this.mRigidBody = r; }
    getRigidBody() { return this.mRigidBody; }

    toggleDrawRenderable() { this.mDrawRenderable = !this.mDrawRenderable; }
    toggleDrawRigidShape() { this.mDrawRigidShape = !this.mDrawRigidShape; }

    draw(aCamera) {
        if (this.isVisible()) {
            if (this.mDrawRenderable)
                this.mRenderComponent.draw(aCamera);
            if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
                this.mRigidBody.draw(aCamera);
        }
    }

    update() {
        // simple default behavior
        if (this.mRigidBody !== null)
            this.mRigidBody.update();
    }

    // Support for per-pixel collision
    pixelTouches(otherObj, wcTouchPos) {
        // only continue if both objects have getColorArray defined 
        // if defined, should have other texture intersection support!
        let pixelTouch = false;
        let myRen = this.getRenderable();
        let otherRen = otherObj.getRenderable();

        if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
            if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
                // no rotation, we can use bbox ...
                let otherBbox = otherObj.getBBox();
                if (otherBbox.intersectsBound(this.getBBox())) {
                    myRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
                }
            } else {
                // One or both are rotated, compute an encompassing circle
                // by using the hypotenuse as radius
                let mySize = myRen.getXform().getSize();
                let otherSize = otherRen.getXform().getSize();
                let myR = Math.sqrt(0.5 * mySize[0] * 0.5 * mySize[0] + 0.5 * mySize[1] * 0.5 * mySize[1]);
                let otherR = Math.sqrt(0.5 * otherSize[0] * 0.5 * otherSize[0] + 0.5 * otherSize[1] * 0.5 * otherSize[1]);
                let d = [];
                vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
                if (vec2.length(d) < (myR + otherR)) {
                    myRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
                }
            }
        }
        return pixelTouch;
    }
}

export default GameObject;