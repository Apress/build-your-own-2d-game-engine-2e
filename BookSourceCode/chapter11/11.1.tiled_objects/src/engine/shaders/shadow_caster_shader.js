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
    constructor(vertexShaderPath, fragmentShaderPath) {
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLight = null;  // The light that casts the shadow
        this.mCamera = null;

        // **** The GLSL Shader must define uLights[1] (array size of 1) <-- as the only light source!!
        this.mShaderLight = new ShaderLightAt(this.mCompiledShader, 0);
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);
        this.mShaderLight.loadToShader(this.mCamera, this.mLight);
    }

    setCameraAndLights(c, l) {
        this.mCamera = c;
        this.mLight = l;
    }
}

export default ShadowCasterShader;