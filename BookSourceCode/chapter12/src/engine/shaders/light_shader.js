/* 
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import ShaderLightAt from "./shader_light_at.js";

class LightShader extends SpriteShader {
    /**
     * @classdesc Supports light illumination of sprites
     * <p>Found in Chapter 8, page 417 of the textbook</p>
     * Examples:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.2.simple_light_shader/index.html 8.2 Simple Light Shader},
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.3.multiple_lights/index.html 8.3 Multiple Lights},
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.6.directional_and_spotlights/index.html 8.6 Directional and Spot Lights}
     * @extends SpriteShader
     * @constructor
     * @param {string} vertexShaderPath -  path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader file
     * @returns {LightShader} a new LightShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLights = null;  // lights from the Renderable
        this.mCamera = null;  // the camera to draw for, required for WC to DC transform

        //*******WARNING***************
        // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl and IllumFS.glsl)
        //*******WARNING********************
        this.kGLSLuLightArraySize = 8;  // <-- make sure this is the same as LightFS.glsl and IllumFS.glsl
        this.mShaderLights = [];
        let i, ls;
        for (i = 0; i < this.kGLSLuLightArraySize; i++) {
            ls = new ShaderLightAt(this.mCompiledShader, i);
            this.mShaderLights.push(ls);
        }
    }

    // Overriding the activation of the shader for rendering
    /**
     * Overrides shader activation to support 
     * @method
     * @param {vec4} pixelColor - [R,G,B,A] color array for the pixels
     * @param {mat4} trsMatrix - translation, rotation, and scaling matrix for the object being rendered
     * @param {mat4} cameraMatrix - translation, rotation, and scaling matrix for the Camera
     */
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now push the light information to the shader
        let numLight = 0;
        if (this.mLights !== null) {
            while (numLight < this.mLights.length) {
                    this.mShaderLights[numLight].loadToShader(this.mCamera, this.mLights[numLight]);
                numLight++;
            }
        }
        // switch off the left over ones.
        while (numLight < this.kGLSLuLightArraySize) {
            this.mShaderLights[numLight].switchOffLight(); // switch off unused lights
            numLight++;
        }
    }

    /**
     * Set the Camera and list of Lights for this LightShader, the length of argument l can not be greater than GLSL light array size
     * @method
     * @param {Camera} c - the Camera this LightShader illuminates
     * @param {Lights[]} l -  List of Light objects for this LightShader
     */
    setCameraAndLights(c, l) {
        this.mCamera = c;
        this.mLights = l;
        if (this.mLights.length > this.kGLSLuLightArraySize)
            throw new Error ("Error: " + this.mLights.length + " lights requested. Current max light source supported is: " + this.kGLSLuLightArraySize + " update kGLSLuLightArraySize variable in light_shader.js  AND  light_fs.glsl to the proper number.");
    }
}

export default LightShader;