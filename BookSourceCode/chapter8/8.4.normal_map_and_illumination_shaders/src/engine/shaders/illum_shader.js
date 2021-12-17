/* 
 * File: illum_shader.js (support normal map)
 * Subclass from LightShader (to take advantage of light sources)
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import LightShader from "./light_shader.js";
import * as glSys from "../core/gl.js";

class IllumShader extends LightShader {
    // constructor 
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        let gl = glSys.get();
        // reference to the normal map sampler
        this.mNormalSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);
        let gl = glSys.get();
        gl.uniform1i(this.mNormalSamplerRef, 1); // binds to texture unit 1
        // do not need to set up texture coordinate buffer
        // as we are going to use the ones from the sprite texture 
        // in the fragment shader
    }
}

export default IllumShader;