/* 
 * File: lerp_vec2.js
 * Encapsulates linear interpolation of vec2, calls gl-matrixjs::lerp
 */
"use strict";

import Lerp from "./lerp.js";

// vec2 interpolation support
class LerpVec2 extends Lerp {
    /**
     * @classdesc Encapsulates linear interpolation of vec2, calls gl-matrixjs::lerp
     * <p>Found in Chapter 7, page 353 of the textbook</p>
     * Example: 
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter7/7.2.camera_interpolations/index.html 7.2 Camera Interpolations }
     * 
     * @constructor
     * @extends Lerp
     * @param {vec2} value  - starting value of interpolation
     * @param {integer} cycles - number of cycles it should take to reach the target value
     * @param {float} rate - rate at which the value should change at each cycle
     * @returns {LerpVec2} a new LerpVec2 instance
     */
    constructor(value, cycle, rate) {
        super(value, cycle, rate);
    }


    /**
     * Performs a linear interpolation for this LerpVec2
     * @method
     */
    _interpolateValue() {
        vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
    }
}

export default LerpVec2;