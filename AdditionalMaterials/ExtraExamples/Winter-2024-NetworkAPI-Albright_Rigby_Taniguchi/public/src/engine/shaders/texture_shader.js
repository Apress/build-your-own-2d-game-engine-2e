/*
 * File: texture_shader.js
 *
 * wrapps over GLSL texture shader, supporting the working with the entire file texture
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import  SimpleShader from "./simple_shader.js";

class TextureShader extends SimpleShader {
    /**
     * @classdesc Wraps over GLSL texture shader, supports working with the entire file texture
     * <p> Found in Chapter 5, page 197 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.1.texture_shaders/index.html 5.1 Texture Shader}
     * @extends SimpleShader
     * @constructor
     * @param {string} vertexShaderPath - path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader path
     * @returns {TextureShader} a new TextureShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        // reference to aTextureCoordinate within the shader
        this.mTextureCoordinateRef = null;

        // get the reference of aTextureCoordinate within the shader
        let gl = glSys.get();
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
        this.mSamplerRef =  gl.getUniformLocation(this.mCompiledShader, "uSampler");
    }

    // Overriding the activation of the shader for rendering

    /**
     * Overrides the activation of this shader for rending
     * @method
     * @param {vec4} pixelColor - [R,G,B,A] color array for the pixels
     * @param {mat4} trsMatrix - translation, rotation, and scaling matrix for the object being rendered
     * @param {mat4} cameraMatrix - translation, rotation, and scaling matrix for the Camera
     */
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);        

        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0
    }


    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default TextureShader;