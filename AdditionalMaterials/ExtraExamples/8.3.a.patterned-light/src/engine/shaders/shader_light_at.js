/*
 * File: shader_light_at.js 
 *      support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as glSys from "../core/gl.js";

class ShaderLightAt {
    constructor(shader, index) {
        this._setShaderReferences(shader, index);
    }

    loadToShader(aCamera, aLight) {
        let gl = glSys.get();
        gl.uniform1i(this.mIsOnRef, aLight.isLightOn());
        // Process a light only when it is switched on
        if (aLight.isLightOn()) {
            let p = aCamera.wcPosToPixel(aLight.getPosition());
            let n = aCamera.wcSizeToPixel(aLight.getNear());
            let f = aCamera.wcSizeToPixel(aLight.getFar());
            let c = aLight.getColor();
            gl.uniform4fv(this.mColorRef, c);
            gl.uniform3fv(this.mPosRef, vec3.fromValues(p[0], p[1], p[2]));
            gl.uniform1f(this.mNearRef, n);
            gl.uniform1f(this.mFarRef, f);
            gl.uniform1f(this.mIntensityRef, aLight.getIntensity());
        }
    }

    switchOffLight() {
        let gl = glSys.get();
        gl.uniform1i(this.mIsOnRef, false);
    }
    //</editor-fold>

    //<editor-fold desc="private functions">
    _setShaderReferences(aLightShader, index) {
        let gl = glSys.get();
        this.mColorRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Color");
        this.mPosRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Position");
        this.mNearRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Near");
        this.mFarRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Far");
        this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
        this.mIsOnRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].IsOn");
    }

}

export default ShaderLightAt;