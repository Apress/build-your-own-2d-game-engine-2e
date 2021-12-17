/* 
 * File: rigid_circle_main.js
 * 
 *       Rigid circle class definition file
 */
"use strict";

import RigidShape from "./rigid_shape.js";
import * as debugDraw from "../core/debug_draw.js";

class RigidCircle extends RigidShape {
    constructor(xf, radius) {
        super(xf);
        this.mType = "RigidCircle";
        this.mRadius = radius;
        this.mBoundRadius = radius;
    }

    incShapeSizeBy(dt) { 
        this.mRadius += dt; 
        this.mBoundRadius = this.mRadius;
    }

    draw(aCamera) {
        let p = this.mXform.getPosition();
        debugDraw.drawCircle(aCamera, p, this.mRadius, this._shapeColor());  // the circle object

        let u = [p[0], p[1] + this.mBoundRadius];
        // angular motion
        vec2.rotateWRT(u, u, this.mXform.getRotationInRad(), p);
        debugDraw.drawLine(aCamera, p, u, false, this._shapeColor()); // show rotation 

        super.draw(aCamera);  // draw last to be on top
    }

    getRadius() { return this.mRadius; }
}

export default RigidCircle;