/* 
 * File: lerp.js
 *       Encapsulates the LERP function
 */
"use strict";


// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
class Lerp {
    /**
     * @classdesc Encapsulates the linear interpolation functionality 
     * <p>Found in Chapter 7, page 347 of the textbook</p>
     * Example:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter7/7.2.camera_interpolations/index.html 7.2 Camera Interpolations}
     * 
     * @constructor
     * @param {float} value  - starting value of interpolation
     * @param {integer} cycles - number of cycles it should take to reach the target value
     * @param {float} rate - rate at which the value should change at each cycle
     * @returns {Lerp} a new Lerp instance
     */
    constructor(value, cycles, rate) {
        this.mCurrentValue = value;    // begin value of interpolation
        this.mFinalValue = value;      // final value of interpolation
        this.mCycles = cycles;
        this.mRate = rate;

        // if there is a new value to interpolate to, number of cycles left for interpolation
        this.mCyclesLeft = 0;
    }
    /**
     * Returns the current value of this Lerp
     * @method
     * @returns {float} mCurrentValue - the current value of this Lerp
     */
    get() { return this.mCurrentValue; }

    /**
     * Sets the final value for this Lerp and starts interpolation
     * @method
     * @param {float} v - the target value to be set
     */
    setFinal(v) {
        this.mFinalValue = v;
        this.mCyclesLeft = this.mCycles;     // will trigger interpolation
    }

    /**
     * Method called by Gameloop, interpolates value if there are remaining cycles
     * @method
     * @return {void}
     */
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
    /**
     * Sets the rate and number of cyles of this Lerp
     * @method
     * @param {float} stiffness - the new rate for this Lerp
     * @param {integer} duration - the new number of cycles for this Lerp
     */
    config(stiffness, duration) {
        this.mRate = stiffness;
        this.mCycles = duration;
    }

    // subclass should override this function for non-scalar values
    /**
     * Calculates the next value using the current value, rate, and diffence between current and target.
     * Internally called by update
     * @method
     */
    _interpolateValue() {
        this.mCurrentValue = this.mCurrentValue + this.mRate * (this.mFinalValue - this.mCurrentValue);
    }
}

export default Lerp;