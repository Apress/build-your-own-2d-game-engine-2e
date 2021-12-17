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

    setDrawVertices(s) { this.mDrawVertices = s; }
    setShowLine(s) { this.mShowLine = s; }
    setPointSize(s) { this.mPointSize = s; }

    setVertices(x1, y1, x2, y2) {
        this.setFirstVertex(x1, y1);
        this.setSecondVertex(x2, y2);
    }

    setFirstVertex(x, y) {
        this.mP1[0] = x;
        this.mP1[1] = y;
    }

    setSecondVertex(x, y) {
        this.mP2[0] = x;
        this.mP2[1] = y;
    }
}

export default LineRenderable;