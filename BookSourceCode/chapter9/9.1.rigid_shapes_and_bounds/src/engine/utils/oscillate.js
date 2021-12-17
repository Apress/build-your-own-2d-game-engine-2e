/* 
 * File: oscillate.js
 * traces the locus of a damped simple harmonic function
 */
"use strict";

//
//
// damped simple harmonic oscillation
// delta: how large an oscillate
// frequency: how many times to oscillate
// duration: for how long in number of update cycles
//
class Oscillate {
    constructor(delta, frequency, duration) {
        this.mMag = delta;

        this.mCycles = duration; // number of cycles to complete the transition
        this.mOmega = frequency * 2 * Math.PI; // Converts frequency to radians 

        this.mNumCyclesLeft = duration;
    }

    reStart() {
        this.mNumCyclesLeft = this.mCycles;
    }

    done() {
        return (this.mNumCyclesLeft <= 0);
    }

    getNext() {
        this.mNumCyclesLeft--;
        let v = 0;
        if (!this.done()) {
            v = this._nextValue();
        }
        return (v * this.mMag);
    }

    // local/protected methods
    _nextValue() {
        return (this._nextDampedHarmonic());
    }

    _nextDampedHarmonic() {
        // computes (Cycles) * cos(  Omega * t )
        let frac = this.mNumCyclesLeft / this.mCycles;
        return frac * frac * Math.cos((1 - frac) * this.mOmega);
    }
}

export default Oscillate;