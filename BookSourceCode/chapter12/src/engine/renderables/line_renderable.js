/*
 * File: line_renderable.js
 *  
 * Renderable class for lines
 */
"use strict";

import * as glSys from "../core/gl.js";
import Renderable from "./renderable.js";
import * as shaderResources from "../core/shader_resources.js";

class LineRenderable extends Renderable {
    // p1, p2: either both there, or none
    /**
     * Renderable class for lines
     * @extends Renderable
     * @constructor
     * @param {float} x1 - X world coordinate of first vertext
     * @param {float} y1 - Y world coordinate of first vertext
     * @param {float} x2 - X world coordinate of second vertext
     * @param {float} y2 - Y world coordinate of second vertext
     */
    constructor(x1, y1, x2, y2) {
        super();
        this.setColor([0, 0, 0, 1]);
        this._setShader(shaderResources.getLineShader());

        this.mPointSize = 1;
        this.mDrawVertices = false;
        this.mShowLine = true;

        this.mP1 = vec2.fromValues(0, 0);
        this.mP2 = vec2.fromValues(0, 0);

        if (x1 !== "undefined") {
            this.setVertices(x1, y1, x2, y2);
        }
    }

    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------

    /**
     * Draw this LineRenderable to the Camera
     * @method
     * @param {Camera} camera - the Camera to draw to
     */
    draw(camera) {
        let sx = this.mP1[0] - this.mP2[0];
        let sy = this.mP1[1] - this.mP2[1];
        let cx = this.mP1[0] - sx / 2;
        let cy = this.mP1[1] - sy / 2;
        let xf = this.getXform();
        xf.setSize(sx, sy);
        xf.setPosition(cx, cy);
        
        this.mShader.setPointSize(this.mPointSize);
        this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());

        // Draw line instead of triangle!
        let gl = glSys.get();
        if (this.mShowLine) {
            gl.drawArrays(gl.LINE_STRIP, 0, 2);
        }
        if (!this.mShowLine || this.mDrawVertices) {
            gl.drawArrays(gl.POINTS, 0, 2);
        }
    }

    /**
     * Set whether points at the vertices are drawn
     * @method
     * @param {boolean} s - true to draw vertices
     */
    setDrawVertices(s) { this.mDrawVertices = s; }
    /**
     * Set whether the line between the vertices is drawn
     * @method
     * @param {boolean} s - true to draw the line
     */
    setShowLine(s) { this.mShowLine = s; }
    /**
     * Set the pixel diameter of the vertex points
     * @method
     * @param {float} s - the diameter of the point in pixels
     */
    setPointSize(s) { this.mPointSize = s; }

    /**
     * Set world coordinates for both vertices of this LineRenderable
     * @method
     * @param {float} x1 - X world coordinate of first vertext
     * @param {float} y1 - Y world coordinate of first vertext
     * @param {float} x2 - X world coordinate of second vertext
     * @param {float} y2 - Y world coordinate of second vertext
     */
    setVertices(x1, y1, x2, y2) {
        this.setFirstVertex(x1, y1);
        this.setSecondVertex(x2, y2);
    }

    /**
     * Set world coordinates for the first vertex of this LineRenderable
     * @method
     * @param {float} x1 - X world coordinate of first vertext
     * @param {float} y1 - Y world coordinate of first vertext
     */
    setFirstVertex(x, y) {
        this.mP1[0] = x;
        this.mP1[1] = y;
    }

    /**
     * Set world coordinates for the second vertex of this LineRenderable
     * @method
     * @param {float} x1 - X world coordinate of second vertext
     * @param {float} y1 - Y world coordinate of second vertext
     */
    setSecondVertex(x, y) {
        this.mP2[0] = x;
        this.mP2[1] = y;
    }
}

export default LineRenderable;