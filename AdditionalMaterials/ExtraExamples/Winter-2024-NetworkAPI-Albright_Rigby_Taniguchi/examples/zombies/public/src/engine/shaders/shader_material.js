/* 
 * File: shader_material.js
 * Knows how to load aMaterial into the IllumShader
 * Reference point to uMaterial.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as glSys from "../core/gl.js";

class ShaderMaterial {
    /**
     * @classdesc Support object for loading properties of a Material into GLSL
     * <p>Found in Chapter 8, page 466 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter8/8.7.shadow_shaders/index.html 8.7 Shadow Shaders}
     * @constructor
     * @param {WebGLProgram} aIllumShader - compiled IllumShader program this ShaderMaterial belongs to
     */
    constructor(aIllumShader) {
        let gl = glSys.get();
        this.mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
        this.mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
        this.mKsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
        this.mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
    }
    /**
     * Loads a Material into the IllumShader
     * @method
     * @param {Material} aMaterial - Material to load into GLSL
     */
    loadToShader(aMaterial) {
        let gl = glSys.get();
        gl.uniform4fv(this.mKaRef, aMaterial.getAmbient());
        gl.uniform4fv(this.mKdRef, aMaterial.getDiffuse());
        gl.uniform4fv(this.mKsRef, aMaterial.getSpecular());
        gl.uniform1f(this.mShineRef, aMaterial.getShininess());
    }
}

export default ShaderMaterial;