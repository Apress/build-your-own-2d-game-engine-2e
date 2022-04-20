/* 
 * File: camera_state.js
 * Defines the state of a camera to facilitate the manipulation of this state
 */
"use strict";

import Lerp from "../utils/lerp.js";
import LerpVec2 from "../utils/lerp_vec2.js";

class CameraState {
    //
    /**
     * Defines the state of a camera to facilitate the manipulation of this state
     * @constructor
     * @param {vec2} center - the center world coordinates of the Camera
     * @param {float} width - the width of the Camera
     * @returns {CameraState} a new CameraState instance
     */
    constructor(center, width) {
        this.kCycles = 300;  // number of cycles to complete the transition
        this.kRate = 0.1;  // rate of change for each cycle
        this.mCenter = new LerpVec2(center, this.kCycles, this.kRate);
        this.mWidth = new Lerp(width, this.kCycles, this.kRate);
    }
    /**
     * Returns the vec2 linear interpolation object for the center of this Camera
     * @method
     * @returns {LerpVec2} a vec2 linear inperolation object for the center of this Camera
     */
    getCenter() { return this.mCenter.get(); }
    /**
     * Returns the linear interpolation  object for the width of this Camer
     * @method
     * @returns {Lerp} a linear inperolation object for the center of this Camera
     */
    getWidth() { return this.mWidth.get(); }

    /**
     * Sets the target value for the center LerpVec2 and begins the interpolation
     * @method
     * @param {vec2} c - the target value for the center LerpVec2
     */
    setCenter(c) { this.mCenter.setFinal(c); }
      /**
     * Sets the target value for the width Lerp and begins the interpolation.
     * As the width interpolates so will the Camera height
     * @method
     * @param {float} c - the target value for the width Lerp
     */
    setWidth(w) { this.mWidth.setFinal(w); }
    /**
     * Update the CameraState interpolation values
     * @method
     */
    update() {
        this.mCenter.update();
        this.mWidth.update();
    }
    /**
     * Configure the interpolation of the CameraState
     * @method
     * @param {float} stiffness - the rate for the interpolations
     * @param {integer} duration - the number of cycles for the interpolations
     */
    config(stiffness, duration) {
        this.mCenter.config(stiffness, duration);
        this.mWidth.config(stiffness, duration);
    }
}

export default CameraState;