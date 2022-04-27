/* 
 * File: shader_material.js
 * Knows how to load aMaterial into the IllumShader
 * Reference point to uMaterial.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as glSys from "../core/gl.js";

class ShaderMaterial {
    /**
     * Support object for loading properties of a Material into GLSL
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