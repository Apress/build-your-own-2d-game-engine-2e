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
/**
 * Enum for light type
 * @memberof light
 */
const eLightType = Object.freeze({
    ePointLight: 0,
    eDirectionalLight: 1,
    eSpotLight: 2
});

class Light {
    /**
     * @classdesc Defines a simple light source that can be a point light, directional light, or spot light
     * <p>Found in Chapter 8, page 410 of the textbook </p>
     * Examples:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.2.simple_light_shader/index.html 8.2 Simple Light Shader},
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.6.directional_and_spotlights/index.html 8.6 Directional and Spot Lights}, 
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.7.shadow_shaders/index.html 8.7 Shadow Shaders}
     * @constructor
     * @returns {Light} a new Light instance
     */
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
    /**
     * Set the color of the light for this Light
     * @param {vec4} c - [R,G,B,A] color array 
     */
    setColor(c) { this.mColor = vec4.clone(c); }
    /**
     * Returns the color of this Light
     * @returns {vec4} mColor - [R,G,B,A] color array 
     */
    getColor() { return this.mColor; }

    /**
     * Set the 2D world coordinate position for this Light
     * @param {vec2} p - [X,Y] position
     */
    set2DPosition(p) { this.mPosition = vec3.fromValues(p[0], p[1], this.mPosition[2]); }

    /**
     * Set the X world coordinate position of this Light
     * @method
     * @param {float} x - new X position 
     */
    setXPos(x) { this.mPosition[0] = x; }
    /**
     * Set the Y world coordinate position of this Light
     * @method
     * @param {float} y - new Y position 
     */
    setYPos(y) { this.mPosition[1] = y; }
    /**
     * Set the Z world coordinate position of this Light
     * @method
     * @param {float} z - new Z position 
     */
    setZPos(z) { this.mPosition[2] = z; }

    /**
     * Returns the world coordinates of this Light
     * @method
     * @returns {vec3} mPosition - 3D position vector
     */
    getPosition() { return this.mPosition; }

    /**
     * Set the direction vector of this Light
     * @method
     * @param {vec3} d - direction vector 
     */
    setDirection(d) { this.mDirection = vec3.clone(d); }
    
    /**
     * Returns the direction vector of this Light
     * @method
     * @returns {vec3} mDirection - the direction vector
     */
    getDirection() { return this.mDirection; }

    /**
     * Set the near radius in WC space for this Light
     * @method
     * @param {float} n - the new near radius 
     */
    setNear(n) { this.mNear = n; }

    /**
     * Returns the near radius in WC space for this Light
     * @method
     * @returns {float} mNear - current near radius
     */
    getNear() { return this.mNear; }

    
    /**
     * Set the far radius in WC space for this Light.
     * Objects beyond this radius are not illuminated by this Light
     * @method
     * @param {float} f - the new far radius 
     */
    setFar(f) { this.mFar = f; }

     /**
     * Returns the far radius in WC space for this Light
     * @method
     * @returns {float} mFar - current far radius
     */
    getFar() { return this.mFar; }


    /**
     * Set the new inner cone angle of this Light
     * @method
     * @param {float} r - angle in radians
     */
    setInner(r) { this.mInner = r; }

    /**
     * Returns the inner cone angle of this Light
     * @method
     * @returns {float} mInner - current angle in radians
     */
    getInner() { return this.mInner; }

    /**
     * Set the new outer cone angle of this Light
     * @method
     * @param {float} r - angle in radians
     */
    setOuter(r) { this.mOuter = r; }
    /**
     * Returns the outer cone angle of this Light
     * @method
     * @returns {float} mOuter - current angle in radians
     */
    getOuter() { return this.mOuter; }

    /**
     * Set the intensity level of this Light
     * @method
     * @param {float} i - the new intensity 
     */
    setIntensity(i) { this.mIntensity = i; }

    /**
     * Returns the intensity level of this Light
     * @method
     * @returns {float} mIntensity - the current intensity 
     */
    getIntensity() { return this.mIntensity; }

    

    /**
     * Set how quickly does light intensity drops off between inner/outer, Near/Far. 
     * A larger Drop off number results in “softer/smoother” transition from full illumination to no illumination
     * @method
     * @param {flaot} d - the new drop off value 
     */
    setDropOff(d) { this.mDropOff = d; }
    /**
     * Returns the current drop off value of this Light
     * @method
     * @returns {float} mDropOff - current drop off value
     */
    getDropOff() { return this.mDropOff; }

    /**
     * Set what type of light this Light is
     * @method
     * @param {eLightType} t - enum for point, directional, or spotlight 
     */
    setLightType(t) { this.mLightType = t; }
    /**
     * Returns what type of light this Light is
     * @method
     * @returns {eLightType} mLightType - enum for point, directional, or spotlight
     */
    getLightType() { return this.mLightType; }

    /**
     * Returns whether this Light is on
     * @method
     * @returns {boolean} true if the light is on
     */
    isLightOn() { return this.mIsOn; }

    /**
     * Set whether this Light is on or off
     * @method
     * @param {boolean} on - true turns this Light on
     */
    setLightTo(on) { this.mIsOn = on; }

    /**
     *Returns whether or not this Light casts a shadow 
     * @method
     * @returns {boolean} mCastShadow - true if a shadow is cast
     */
    isLightCastShadow() { return this.mCastShadow; }

    /**
     * Set whether this Light casts a shadow
     * @method
     * @param {boolean} on - true casts a shadow
     */
    setLightCastShadowTo(on) { this.mCastShadow = on; }
}

export { eLightType }
export default Light;