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
    
    setTextureCoordinate(texCoord) {
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
    }

    cleanUp() {
        let gl = glSys.get();
        gl.deleteBuffer(this.mTexCoordBuffer);
        // now call super class' clean up ...
        super.cleanUp();
    }
}

export default SpriteShader;