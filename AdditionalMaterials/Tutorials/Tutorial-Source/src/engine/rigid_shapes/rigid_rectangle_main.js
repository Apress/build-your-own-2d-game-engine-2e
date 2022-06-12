/* 
 * File: rigid_rectangle_main.js
 * 
 *       RigidRectangle class definition file
 */
"use strict";

import RigidShape from "./rigid_shape.js";
import * as debugDraw from "../core/debug_draw.js";

class RigidRectangle extends RigidShape {
    /**
     * @classdesc Defines a rigid rectangle shape supported by the physics systems
     * <p>Found in Chapter 9, page 537 of the textbook</p>
     *
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.1.rigid_shapes_and_bounds/index.html 9.1 Rigid Shape and Bounds},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.3.rectangle_collisions/index.html 9.3 Rectangle Collisions},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.6.collision_position_correction/index.html 9.6 Collision Position Correction},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter9/9.9.physics_presets/index.html 9.9 Physics Presets}
     * 
     * 
     * @extends RigidShape
     * @constructor
     * @param {Transform} xf - the Transform for this RigidRectangle
     * @param {float} width - the width of the rectangle
     * @param {float} height - the height of the rectangle
     * @return {RigidRectangle} a new RigidRectangle instance
     */
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

    /**
     * Update the inertia of this RigidRectangle
     * @method
     */
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

    /**
     * Adds a value to the width and height of this RigidRectangle.
     * Updates the vertices and inertia automatically
     * @param {float} dt - the value to add
     */
    incShapeSizeBy(dt) {
        this.mHeight += dt;
        this.mWidth += dt;
        this.setVertices();
        this.rotateVertices();
        this.updateInertia();
    }

    /**
     * Set the world coordinate position of this RigidRectangle.
     * Updates the vertices
     * @method
     * @param {float} x - horizontal position
     * @param {float} y - vertical position
     */
    setPosition(x, y) {
        super.setPosition(x, y);
        this.setVertices();
        this.rotateVertices();
    }

    /**
     * Adjust the position of this RigidRectangle by moving the position a distance along a specified vector.
     * Updates the vertices
     * @method
     * @param {vec2} v - the [X,Y] direction vector
     * @param {float} delta - the distance to move
     */
    adjustPositionBy(v, delta) {
        super.adjustPositionBy(v, delta);
        this.setVertices();
        this.rotateVertices();
    }

    /**
     * Calculates the world coordinates of the vertices of this RigidRectangle 
     * @method
     */
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

    /**
     * Change the Transform for this RigidRectangle
     * @method
     * @param {Transform} xf - the Transform for this RigidRectangle
     */
    setTransform(xf) {
        super.setTransform(xf);
        this.setVertices();
        this.rotateVertices();
    }

    /**
     * Computes the normal vectors for each of this RigidRectangle's sides 
     * @method
     */
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

    /**
     * Match the rotation of the vertices and face normals to the rotation of the Transform for this RigidRectangle
     * @method
     */
    rotateVertices() {
        let center = this.mXform.getPosition();
        let r = this.mXform.getRotationInRad();
        for (let i = 0; i < 4; i++) {
            vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
        }
        this.computeFaceNormals();
    }

    /**
     * Draws this RigidRectangle to aCamera
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    draw(aCamera) {
        super.draw(aCamera);  // the cross marker at the center
        debugDraw.drawRectangle(aCamera, this.mVertex, this._shapeColor());
    }

    /**
     * Updates the motion and verticies of this RigidRectangle
     * @method
     */
    update() {
        super.update();
        this.setVertices();
        this.rotateVertices();
    }
}

export default RigidRectangle;