/*
 * File: camera.js
 *
 * Encapsulates the user define WC and Viewport functionality
 */
"use strict";

import * as glSys from "./core/gl.js";

const eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

class Camera {
    // wcCenter: is a vec2
    // wcWidth: is the width of the user defined WC
    //      Height of the user defined WC is implicitly defined by the viewport aspect ratio
    //      Please refer to the following
    // viewportRect: an array of 4 elements
    //      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
    //      [2]: width of viewport
    //      [3]: height of viewport
    //      
    //  wcHeight = wcWidth * viewport[3]/viewport[2]
    //
    constructor(wcCenter, wcWidth, viewportArray) {
        this.mWCCenter = wcCenter;
        this.mWCWidth = wcWidth;
        this.mViewport = viewportArray;  // [x, y, width, height]

        // Camera transform operator
        this.mCameraMatrix = mat4.create();

        // background color
        this.mBGColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    }

    // #region Basic getter and setters

    setWCCenter(xPos, yPos) {
        this.mWCCenter[0] = xPos;
        this.mWCCenter[1] = yPos;
    }
    getWCCenter() { return this.mWCCenter; }
    setWCWidth(width) { this.mWCWidth = width; }
    getWCWidth() { return this.mWCWidth; }
    getWCHeight() {
        // viewportH/viewportW
        let ratio = this.mViewport[eViewport.eHeight] / this.mViewport[eViewport.eWidth];
        return this.getWCWidth() * ratio;
    }  

    setViewport(viewportArray) { this.mViewport = viewportArray; }
    getViewport() { return this.mViewport; }

    setBackgroundColor(newColor) { this.mBGColor = newColor; }
    getBackgroundColor() { return this.mBGColor; }
    // #endregion

    // #region Compute and access camera transform matrix
    
    // call before you start drawing with this camera
    setViewAndCameraMatrix() {
        let gl = glSys.get();
        // Step A1: Set up the viewport: area on canvas to be drawn
        gl.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        gl.scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
            this.mViewport[1], // y position of bottom-left corner of the area to be drawn
            this.mViewport[2], // width of the area to be drawn
            this.mViewport[3]);// height of the area to be drawn
        
            // Step A3: set the color to be clear
        gl.clearColor(this.mBGColor[0], this.mBGColor[1], this.mBGColor[2], this.mBGColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);

        // Step B: Compute the Camera Matrix
        let center = this.getWCCenter();
        
        // Step B1: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(this.mCameraMatrix, mat4.create(), vec3.fromValues(2.0 / this.getWCWidth(), 2.0 / this.getWCHeight(), 1.0));

        // Step B2: first operation to perform is to translate camera center to the origin
        mat4.translate(this.mCameraMatrix, this.mCameraMatrix, vec3.fromValues(-center[0], -center[1], 0));
    }

    // Getter for the View-Projection transform operator
    getCameraMatrix() {
        return this.mCameraMatrix;
    }
    // #endregion
}

export default Camera;