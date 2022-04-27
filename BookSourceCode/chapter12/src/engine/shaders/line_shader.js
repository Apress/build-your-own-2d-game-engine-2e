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
    /**
     * Shader that creates straight lines with vertices to support debugging physics engine
     * @extends SimpleShader
     * @constructor
     * @param {string} vertexShaderPath - path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader file
     * @returns {LineShader} a new LineShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        super(vertexShaderPath, fragmentShaderPath);
        let gl = glSys.get();

        this.mPointSizeRef = null;            // reference to the PointSize uniform

        // point size uniform
        this.mPointSizeRef = gl.getUniformLocation(this.mCompiledShader, "uPointSize");

        this.mPointSize = 1;
    }

    // Activate the shader for rendering
 
     /**
     * Activate this LineShader to render a line
     * @method
     * @param {vec4} pixelColor - [R,G,B,A] color array for the pixels of the line and vertices
     * @param {mat4} trsMatrix - translation, rotation, and scaling matrix for the line being rendered
     * @param {mat4} cameraMatrix - translation, rotation, and scaling matrix for the Camera
     */
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

    /**
     * Set the pixel diameter of line end points for this LineShader
     * @method
     * @param {integer} w - the pixel diameter
     */
    setPointSize(w) { this.mPointSize = w; }
}

export default LineShader;