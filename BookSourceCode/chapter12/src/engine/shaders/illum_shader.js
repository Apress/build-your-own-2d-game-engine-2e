/* 
 * File: illum_shader.js (support normal map)
 * Subclass from LightShader (to take advantage of light sources)
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import LightShader from "./light_shader.js";
import ShaderMaterial from "./shader_material.js";
import * as glSys from "../core/gl.js";

class IllumShader extends LightShader {
    // constructor 
    /**
     * Shader that supports lighting and Phong illumination
     * @extends LightShader
     * @constructor
     * @param {string} vertexShaderPath - path to the vertex shader file
     * @param {string} fragmentShaderPath - path to the fragment shader file
     * @returns {IllumShader} a new IllumShader instance
     */
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        // this is the material property of the Renderable
        this.mMaterial = null;
        this.mMaterialLoader = new ShaderMaterial(this.mCompiledShader);

        let gl = glSys.get();
        // Reference to the camera position
        this.mCameraPos = null;  // points to a vec3
        this.mCameraPosRef = gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");

        // reference to the normal map sampler
        this.mNormalSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
    }

    // Overriding the activation of the shader for rendering
    /**
     * Activate this IllumShader for rendering
     * @method
     * @param {vec4} pixelColor - [R,G,B,A] color array for the pixels
     * @param {mat4} trsMatrix - translation, rotation, and scaling matrix for the object being rendered
     * @param {mat4} cameraMatrix - translation, rotation, and scaling matrix for the Camera
     */
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);
        let gl = glSys.get();
        gl.uniform1i(this.mNormalSamplerRef, 1); // binds to texture unit 1
        // do not need to set up texture coordinate buffer
        // as we are going to use the ones from the sprite texture 
        // in the fragment shader
        this.mMaterialLoader.loadToShader(this.mMaterial);
        gl.uniform3fv(this.mCameraPosRef, this.mCameraPos);
    }

    /**
     * Set the Camera position and Material for this IllumShader to use
     * @method
     * @param {Material} m - the Material for this IllumShader
     * @param {vec3} p - world coordinate [X,Y,Z] Camera position
     */
    setMaterialAndCameraPos(m, p) {
        this.mMaterial = m;
        this.mCameraPos = p;
    }
}

export default IllumShader;