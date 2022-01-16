/* 
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import * as glSys from "../core/gl.js";

class LightShader extends SpriteShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        // glsl uniform position references
        this.mColorRef = null;
        this.mPosRef = null;
        this.mRadiusRef = null;
        this.mIsOnRef = null;

        this.mLight = null; // <-- this is the light source in the Game Engine
        this.mCamera = null; // the camera to draw for, required for WC to DC transform
        //
        // create the references to these uniforms in the LightShader
        let shader = this.mCompiledShader;
        let gl = glSys.get();
        this.mColorRef = gl.getUniformLocation(shader, "uLightColor");
        this.mPosRef = gl.getUniformLocation(shader, "uLightPosition");
        this.mRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
        this.mIsOnRef = gl.getUniformLocation(shader, "uLightOn");
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        if (this.mLight !== null) {
            this._loadToShader();
        } else {
            glSys.get().uniform1i(this.mIsOnRef, false); // <-- switch off the light!
        }
    }

    setCameraAndLight(c, l) {
        this.mCamera = c;
        this.mLight = l;
    }

    _loadToShader() {
        let gl = glSys.get();
        gl.uniform1i(this.mIsOnRef, this.mLight.isLightOn());
        if (this.mLight.isLightOn()) {
            let p = this.mCamera.wcPosToPixel(this.mLight.getPosition());
            let r = this.mCamera.wcSizeToPixel(this.mLight.getRadius());
            let c = this.mLight.getColor();

            gl.uniform4fv(this.mColorRef, c);
            gl.uniform3fv(this.mPosRef, vec3.fromValues(p[0], p[1], p[2]));
            gl.uniform1f(this.mRadiusRef, r);
        }
    }
}

export default LightShader;