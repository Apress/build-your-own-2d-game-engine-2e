/*
 * File: shader_light_at.js 
 *      support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as glSys from "../core/gl.js";
import { eLightType } from "../lights/light.js";

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
            gl.uniform1f(this.mInnerRef, 0.0);
            gl.uniform1f(this.mOuterRef, 0.0);
            gl.uniform1f(this.mIntensityRef, aLight.getIntensity());
            gl.uniform1f(this.mDropOffRef, 0);
            gl.uniform1i(this.mLightTypeRef, aLight.getLightType());

            // Point light does not need the direction
            if (aLight.getLightType() === eLightType.ePointLight) {
                gl.uniform3fv(this.mDirRef, vec3.fromValues(0, 0, 0));
            } else {
                // either spot or directional lights: must compute direction
                let d = aCamera.wcDirToPixel(aLight.getDirection());
                gl.uniform3fv(this.mDirRef, vec3.fromValues(d[0], d[1], d[2]));
                if (aLight.getLightType() === eLightType.eSpotLight) {
                    gl.uniform1f(this.mInnerRef, Math.cos(0.5 * aLight.getInner())); // stores the cosine of half of inner cone angle
                    gl.uniform1f(this.mOuterRef, Math.cos(0.5 * aLight.getOuter())); // stores the cosine of half of outer cone angle
                    gl.uniform1f(this.mDropOffRef, aLight.getDropOff());
                }
            }
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
        this.mDirRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Direction");
        this.mNearRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Near");
        this.mFarRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Far");
        this.mInnerRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].CosInner");
        this.mOuterRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].CosOuter");
        this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
        this.mDropOffRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].DropOff");
        this.mIsOnRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].IsOn");
        this.mLightTypeRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].LightType");
    }

}

export default ShaderLightAt;