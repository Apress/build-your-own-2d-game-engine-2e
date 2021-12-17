/* 
 * File: light.js
 * Defines a simple light source
 */
"use strict";

class Light {

    constructor() {
        this.mColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
        this.mPosition = vec3.fromValues(0, 0, 5); // light position in WC
        this.mNear = 5;  // effective radius in WC
        this.mFar = 10;  // within near is full on, outside far is off
        this.mIntensity = 1;
        this.mIsOn = true;
    }

    // simple setters and getters
    setColor(c) { this.mColor = vec4.clone(c); }
    getColor() { return this.mColor; }

    set2DPosition(p) { this.mPosition = vec3.fromValues(p[0], p[1], this.mPosition[2]); }
    setXPos(x) { this.mPosition[0] = x; }
    setYPos(y) { this.mPosition[1] = y; }
    setZPos(z) { this.mPosition[2] = z; }
    getPosition() { return this.mPosition; }

    setNear(n) { this.mNear = n; }
    getNear() { return this.mNear; }

    setFar(f) { this.mFar = f; }
    getFar() { return this.mFar; }

    setIntensity(i) { this.mIntensity = i; }
    getIntensity() { return this.mIntensity; }

    isLightOn() { return this.mIsOn; }
    setLightTo(on) { this.mIsOn = on; }
}

export default Light;