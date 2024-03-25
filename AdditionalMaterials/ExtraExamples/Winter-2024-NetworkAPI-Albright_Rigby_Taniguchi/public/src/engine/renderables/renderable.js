/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "../core/gl.js";
import Transform from "../utils/transform.js";
import * as shaderResources from "../core/shader_resources.js";

class Renderable {
    /**
     * @classdesc Defualt constructor creates a renderable instance of a white square.
     * Encapsulate the Shader and vertexBuffer into the same object (and will include
     * other attributes later) to represent a Renderable object on the game screen.
     * <p>Found in Chapter 3, page 71 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter3/3.1.renderable_objects/index.html 3.1 Renderable Objects}
     * 
     * @constructor Renderable
     * @returns {Renderable} a new instance of Renderable
     */
    constructor() {
        this.mShader = shaderResources.getConstColorShader();  // get the constant color shader
        this.mXform = new Transform(); // transform that moves this object around
        this.mColor = [1, 1, 1, 1];    // color of pixel
    }
    /**
     * Draws the Renderable to the screen in the Camera viewport
     * @method
     * @param {Camera} Camera object to draw to
     */
    draw(camera) {
        let gl = glSys.get();
        this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
     /**
     * Returns the Transform object of this Renderable
     * @method
     * @returns {Transform}  - the Transform object of this Renderable
     */
    getXform() { return this.mXform; }

    /**
     * Sets the constant color of this Renderable
     * @method
     * @param {float[]} color - the new color formatted as RGBA
     */
    setColor(color) { this.mColor = color; }

    /**
     * Returns the color of this Renderable   
     * @method
     * @returns {float[]} mColor - the current color array of this Renderable 
     */
    getColor() { return this.mColor; }

    /**
     * Sets the shader this Renderable uses and returns the previous shader
     * @method
     * @param {Shader} s  - the new shader for this Renderable to use
     * @returns {Shader} out - the previous shader
     */
    swapShader(s) {
        let out = this.mShader;
        this.mShader = s;
        return out;
    }
    /**
     * Update method called on Gameloop 
     * @method
     */
    update() {} // 
    
    // this is private/protected
    /**
     * Sets the Renderable's Shader
     * @method
     * @param {Shader} s - Shader to set for the Renderable
     */
    _setShader(s) {
        this.mShader = s;
    }
}

export default Renderable;