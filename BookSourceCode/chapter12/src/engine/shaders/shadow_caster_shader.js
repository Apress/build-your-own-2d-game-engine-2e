/* 
 * File: shadow_caster_shader.js
 * Subclass from SpriteShader
 *      a little similar to LightShader, except, only defines
 *      one light: the one that casts the shadow
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import SpriteShader from "./sprite_shader.js";
import ShaderLightAt from "./shader_light_at.js";

class ShadowCasterShader extends SpriteShader {
    // constructor 
    /**
     * Defines a single light shader that casts a shadow
     * @extends SpriteShader
     * @constructor
     * @param {string} vertexShaderPath - path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader file
     * @returns {ShadowCasterShader} a new ShadowCasterShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLight = null;  // The light that casts the shadow
        this.mCamera = null;

        // **** The GLSL Shader must define uLights[1] (array size of 1) <-- as the only light source!!
        this.mShaderLight = new ShaderLightAt(this.mCompiledShader, 0);
    }

    // Overriding the activation of the shader for rendering
    /**
     * Override to activate this ShadowCasterShader with a single ShaderLightAt
     * @method
     * @param {vec4} pixelColor - [R,G,B,A] color array for the pixels
     * @param {mat4} trsMatrix - translation, rotation, and scaling matrix for the object being rendered
     * @param {mat4} cameraMatrix - translation, rotation, and scaling matrix for the Camera
     */
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);
        this.mShaderLight.loadToShader(this.mCamera, this.mLight);
    }

    /**
     * Set the Camera and single Light for this ShadowCasterShader
     * @method
     * @param {Camera} c - the Camera being used
     * @param {Light} l - the shadow casting Light
     */
    setCameraAndLights(c, l) {
        this.mCamera = c;
        this.mLight = l;
    }
}

export default ShadowCasterShader;