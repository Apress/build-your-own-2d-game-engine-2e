/* 
 * File: lerp.js
 *       Encapsulates the LERP function
 */
"use strict";


// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
class Lerp {
    constructor(value, cycles, rate) {
        this.mCurrentValue = value;    // begin value of interpolation
        this.mFinalValue = value;      // final value of interpolation
        this.mCycles = cycles;
        this.mRate = rate;

        // if there is a new value to interpolate to, number of cycles left for interpolation
        this.mCyclesLeft = 0;
    }

    get() { return this.mCurrentValue; }
    setFinal(v) {
        this.mFinalValue = v;
        this.mCyclesLeft = this.mCycles;     // will trigger interpolation
    }

    update() {
        if (this.mCyclesLeft <= 0) {
            return;
        }

        this.mCyclesLeft--;
        if (this.mCyclesLeft === 0) {
            this.mCurrentValue = this.mFinalValue;
        } else {
            this._interpolateValue();
        }
    }

    // stiffness of 1 switches off interpolation
    config(stiffness, duration) {
        this.mRate = stiffness;
        this.mCycles = duration;
    }

    // subclass should override this function for non-scalar values
    _interpolateValue() {
        this.mCurrentValue = this.mCurrentValue + this.mRate * (this.mFinalValue - this.mCurrentValue);
    }
}

export default Lerp;