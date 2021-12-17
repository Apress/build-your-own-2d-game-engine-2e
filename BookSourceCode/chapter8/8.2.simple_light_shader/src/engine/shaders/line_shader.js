/* 
 * File: line_shader.js
 *          for debugging physics engine
 */
"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import SimpleShader from "./simple_shader.js";

class LineShader extends SimpleShader {
    // constructor of LineShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        super(vertexShaderPath, fragmentShaderPath);
        let gl = glSys.get();

        this.mPointSizeRef = null;            // reference to the PointSize uniform

        // point size uniform
        this.mPointSizeRef = gl.getUniformLocation(this.mCompiledShader, "uPointSize");

        this.mPointSize = 1;
    }

    // Activate the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: load the line pont size
        let gl = glSys.get();
        gl.uniform1f(this.mPointSizeRef, this.mPointSize);

        // re-bind the vertex position attribute to the line's buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getLineVertexBuffer());
        gl.vertexAttribPointer(this.mVertexPositionRef,  // this is defined in SimpleShader
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);
        gl.enableVertexAttribArray(this.mVertexPositionRef);
    }

    setPointSize(w) { this.mPointSize = w; }
}

export default LineShader;