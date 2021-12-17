/* 
 * File: lerp_vec2.js
 * Encapsulates linear interpolation of vec2, calls gl-matrixjs::lerp
 */
"use strict";

import Lerp from "./lerp.js";

// vec2 interpolation support
class LerpVec2 extends Lerp {
    constructor(value, cycle, rate) {
        super(value, cycle, rate);
    }

    _interpolateValue() {
        vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
    }
}

export default LerpVec2;