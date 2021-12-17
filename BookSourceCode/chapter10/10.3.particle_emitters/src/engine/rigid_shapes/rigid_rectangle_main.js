/* 
 * File: rigid_rectangle_main.js
 * 
 *       RigidRectangle class definition file
 */
"use strict";

import RigidShape from "./rigid_shape.js";
import * as debugDraw from "../core/debug_draw.js";

class RigidRectangle extends RigidShape {
    constructor(xf, width, height) {
        super(xf);
        this.mType = "RigidRectangle";
        this.mWidth = width;
        this.mHeight = height;
        this.mBoundRadius = 0;
        this.mVertex = [];
        this.mFaceNormal = [];

        this.setVertices();
        this.computeFaceNormals();

        this.updateInertia();
    }

    updateInertia() {
        // Expect this.mInvMass to be already inverted!
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        } else {
            // inertia=mass*width^2+height^2
            this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
            this.mInertia = 1 / this.mInertia;
        }
    }

    incShapeSizeBy(dt) {
        this.mHeight += dt;
        this.mWidth += dt;
        this.setVertices();
        this.rotateVertices();
        this.updateInertia();
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        this.setVertices();
        this.rotateVertices();
    }
    adjustPositionBy(v, delta) {
        super.adjustPositionBy(v, delta);
        this.setVertices();
        this.rotateVertices();
    }

    setVertices() {
        this.mBoundRadius = Math.sqrt(this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 2;
        let center = this.mXform.getPosition();
        let hw = this.mWidth / 2;
        let hh = this.mHeight / 2;
        // 0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
        this.mVertex[0] = vec2.fromValues(center[0] - hw, center[1] - hh);
        this.mVertex[1] = vec2.fromValues(center[0] + hw, center[1] - hh);
        this.mVertex[2] = vec2.fromValues(center[0] + hw, center[1] + hh);
        this.mVertex[3] = vec2.fromValues(center[0] - hw, center[1] + hh);
    }

    setTransform(xf) {
        super.setTransform(xf);
        this.setVertices();
        this.rotateVertices();
    }

    computeFaceNormals() {
        // 0--Top;1--Right;2--Bottom;3--Left
        // mFaceNormal is normal of face toward outside of rectangle    
        for (let i = 0; i < 4; i++) {
            let v = (i + 1) % 4;
            let nv = (i + 2) % 4;
            this.mFaceNormal[i] = vec2.clone(this.mVertex[v]);
            vec2.subtract(this.mFaceNormal[i], this.mFaceNormal[i], this.mVertex[nv]);
            vec2.normalize(this.mFaceNormal[i], this.mFaceNormal[i]);
        }
    }

    rotateVertices() {
        let center = this.mXform.getPosition();
        let r = this.mXform.getRotationInRad();
        for (let i = 0; i < 4; i++) {
            vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
        }
        this.computeFaceNormals();
    }

    draw(aCamera) {
        super.draw(aCamera);  // the cross marker at the center
        debugDraw.drawRectangle(aCamera, this.mVertex, this._shapeColor());
    }

    update() {
        super.update();
        this.setVertices();
        this.rotateVertices();
    }
}

export default RigidRectangle;