
/* 
 * File: rigid_shape.js
 *      base class for objects to participate in physics system
 */
"use strict";

import * as debugDraw from "../core/debug_draw.js";

let kShapeColor = [0, 0, 0, 1];
let kBoundColor = [1, 1, 1, 1];

class RigidShape {
    constructor(xf) {
        this.mXform = xf;
        this.mType = "";

        this.mBoundRadius = 0;
        this.mDrawBounds = false;
    }

    // #region getters and setters
    getType() { return this.mType; }

    getCenter() { return this.mXform.getPosition(); }
    getBoundRadius() { return this.mBoundRadius; }

    toggleDrawBound() { this.mDrawBounds = !this.mDrawBounds; }
    setBoundRadius(r) { this.mBoundRadius = r; }

    setTransform(xf) { this.mXform = xf; }
    // #endregion


    setPosition(x, y) {
        this.mXform.setPosition(x, y);
    }
    adjustPositionBy(v, delta) {
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, v, delta);
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

    update() {
        // nothing for now
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
}

export default RigidShape;