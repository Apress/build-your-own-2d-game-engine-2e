/*
 * File: sprite_shader.js
 *
 * wrapps over GLSL texture shader, supporting the defintion of one sprite element
 * from a texture file
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import TextureShader from "./texture_shader.js";

class SpriteShader extends TextureShader {
    /**
     * @classdesc Wraps over GLSL texture shader, supporting the defintion of one sprite element
     * from a texture file
     * <p>Found in Chapter 5, page 222 of the textbook </p>
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.2.sprite_shaders/index.html 5.2 Sprite Shaders},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.3.sprite_animate_shaders/index.html 5.3 Sprite Animation}
     * @extends TextureShader
     * @constructor
     * @param {string} vertexShaderPath - path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader file
     * @returns {SpriteShader} a new SpriteShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call TextureShader constructor

        this.mTexCoordBuffer = null; // this is the reference to gl buffer that contains the actual texture coordinate

        let initTexCoord = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        let gl = glSys.get();
        this.mTexCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
                // DYNAMIC_DRAW: says buffer content may change!
    }

    _getTexCoordBuffer() {
        return this.mTexCoordBuffer;
    }
    
    /**
     * Sets the texture coordinates in UV space for a sprite 
     * @method
     * @param {float[]} texCoord - UV texture coordinate array
     */
    setTextureCoordinate(texCoord) {
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
    }

    /**
     * Delete the texture coordinate buffer and clean up the resources
     * @method
     */
    cleanUp() {
        let gl = glSys.get();
        gl.deleteBuffer(this.mTexCoordBuffer);
        // now call super class' clean up ...
        super.cleanUp();
    }

    // make sure these functions are defined, such that
    // this shader can support LightRenderable and IllumRenderable
    // will be override by LightShader
    setCameraAndLights(c, l) { }

    // will be override by IllumShader
    setMaterialAndCameraPos(m, p) { }
}

export default SpriteShader;