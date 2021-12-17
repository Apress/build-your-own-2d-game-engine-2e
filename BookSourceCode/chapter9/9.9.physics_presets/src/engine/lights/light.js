/* 
 * File: light.js
 * Defines a simple light source
 */
"use strict";

// **** WARNING: The following enumerate values must be identical to 
// the values of
// 
//   ePointLight, eDirectionalLight, eSpotLight
//   
// defined in LightFS.glsl and IllumFS.glsl
const eLightType = Object.freeze({
    ePointLight: 0,
    eDirectionalLight: 1,
    eSpotLight: 2
});

class Light {

    constructor() {
        this.mColor = vec4.fromValues(1, 1, 1, 1);  // light color
        this.mPosition = vec3.fromValues(0, 0, 5); // light position in WC
        this.mDirection = vec3.fromValues(0, 0, -1); // in WC
        this.mNear = 5;  // effective radius in WC
        this.mFar = 10;
        this.mInner = 0.1;  // in radian
        this.mOuter = 0.3;
        this.mIntensity = 1;
        this.mDropOff = 1;  // 
        this.mLightType = eLightType.ePointLight;
        this.mIsOn = true;
        this.mCastShadow = false;
    }

    // simple setters and getters
    setColor(c) { this.mColor = vec4.clone(c); }
    getColor() { return this.mColor; }

    set2DPosition(p) { this.mPosition = vec3.fromValues(p[0], p[1], this.mPosition[2]); }
    setXPos(x) { this.mPosition[0] = x; }
    setYPos(y) { this.mPosition[1] = y; }
    setZPos(z) { this.mPosition[2] = z; }
    getPosition() { return this.mPosition; }

    setDirection(d) { this.mDirection = vec3.clone(d); }
    getDirection() { return this.mDirection; }

    setNear(n) { this.mNear = n; }
    getNear() { return this.mNear; }

    setFar(f) { this.mFar = f; }
    getFar() { return this.mFar; }

    setInner(r) { this.mInner = r; }
    getInner() { return this.mInner; }

    setOuter(r) { this.mOuter = r; }
    getOuter() { return this.mOuter; }

    setIntensity(i) { this.mIntensity = i; }
    getIntensity() { return this.mIntensity; }

    setDropOff(d) { this.mDropOff = d; }
    getDropOff() { return this.mDropOff; }

    setLightType(t) { this.mLightType = t; }
    getLightType() { return this.mLightType; }

    isLightOn() { return this.mIsOn; }
    setLightTo(on) { this.mIsOn = on; }

    isLightCastShadow() { return this.mCastShadow; }
    setLightCastShadowTo(on) { this.mCastShadow = on; }
}

export { eLightType }
export default Light;