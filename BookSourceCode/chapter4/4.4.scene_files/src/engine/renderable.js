/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "./core/gl.js";
import * as shaderResources from "./core/shader_resources.js";
import Transform from "./transform.js";

class Renderable {
    constructor() {
        this.mShader = shaderResources.getConstColorShader();   // the shader for shading this object
        this.mColor = [1, 1, 1, 1];     // color of pixel
        this.mXform = new Transform();  // the transform object 
    }

    draw(camera) {
        let gl = glSys.get();
        this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getXform() { return this.mXform; }
    
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }
}

export default Renderable;