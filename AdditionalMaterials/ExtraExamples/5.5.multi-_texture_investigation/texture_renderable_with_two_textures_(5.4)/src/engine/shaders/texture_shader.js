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
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        this.mTexMat = mat3.create();

        // reference to aTextureCoordinate within the shader
        this.mTextureCoordinateRef = null;

        this.mHasSecondTexture = false;

        // get the reference of aTextureCoordinate within the shader
        let gl = glSys.get();
        this.mSamplerRef =  gl.getUniformLocation(this.mCompiledShader, "uSampler");
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");

        // supporting second set
        this.mTextureCoordinateRef2 = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate2");
        this.mOtherTextureRef = gl.getUniformLocation(this.mCompiledShader, "uOtherTexture");
        this.mHasSecondTextureRef = gl.getUniformLocation(this.mCompiledShader, "uHasSecondTexture");

        // second set of tex coordinate
        let initTexCoord = [
            1.0, 1.0,       // right, top
            0.0, 1.0,       // left, top
            1.0, 0.0,       // right, bottom, 
            0.0, 0.0        // left, bottom
        ];
        this.mSecondTextureCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);        
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.vertexAttribPointer(this.mTextureCoordinateRef2, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef2);
        
        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0
        gl.uniform1i(this.mOtherTextureRef, 1);
        gl.uniform1i(this.mHasSecondTextureRef, this.mHasSecondTexture);
    }

    enableSecondTexture(en) {
        this.mHasSecondTexture = en;
    }

    // all dimension in UV space
    // Our goal: setup texture locations such that
    //           this specify (u,v) and w x h
    //           is the (0.5, 0.5)  and 1 x h  area 
    // Transform required:
    //    pos: (u, v)
    //   size: (w, h)
    //    
    //    left  = u-0.5w
    //    right = left+w
    //    bottom= v-0.5h
    //    top   = bottom+h
    //
    // vertices: v1(top-left), v2(top-right), v3(bottom-left), v4(bottom-right)
    //               u + 0.5w      
    //                (1, 0)       (1, 1)        (0, 0)          (0, 1)
    // 
    //  M * v1 = (1, 0)
    //  M * v2 = (1, 1) ... etc
    // 
    //  M = S(1/w, 1/h) * R(-theta) * T(-left, -bottom)  
    // 
    /*
        The simplest way to support rotation would be to implement the above transformation 
        is to replace the following explicit scale and translation based on mat3 (defined in the gl-matrix.js library)

            let this.mTexMat = mat3.create();

            mat3.identity(this.mTexMat);
            mat3.scale(this.mTexMat, this.mTexMat, [1.0/w, 1.0/h]); // scale such that top-right is (1, 1)
            mat3.translate(this.mTexMat, this.mTexMat, [-left, -bottom]); // bottom-left is now (0, 0)
            mat3.translate(this.mTexMat, this.mTexMat, [u, v]); // return to original position
            mat3.rotate(this.mTexMat, this.mTexMat, -theta);  // rotation wrt to center of u,v
            mat3.translate(this.mTexMat, this.mTexMat, [-u, -v]);

        Define "mat3" in your vertex shader, you can now load this.mTexMat to your glsl vertex shader and transform
        the Texture Coordinate, e.g., in your glsl vertex shader

            attribute vec2 aMyTextureCoordinate; // this is your texture coordinate with range (0, 0) to (1, 1)
            uniform mat3 uMyTexXfromMat;         // this is where you will load the this.mTexMat
            varying vec2 vMyTexCoord;

            void main() {
                ... do what needs to be done 

                // to transform the coordinate texture
                vMyTexCoord = (uMyTexXfromMat * vec3(aMyTextureCoordinate, 1.0)).xy;)
            }
    */
    placeAtWithSize(placement, aspectRatio) {
        // How to use aspectRatio?
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft,  useTop,
            useRight, useBot,
            useLeft,  useBot]));
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default TextureShader;