/* 
 * File: shake.js
 * randomize oscillate results 
 */
"use strict";

import Oscillate from "./oscillate.js";

class Shake extends Oscillate {
    constructor(delta, frequency, duration) {
        super(delta, frequency, duration);
    }

    // randomize the sign of the oscillation magnitude
    _nextValue() {
        let v = this._nextDampedHarmonic();
        let fx = (Math.random() > 0.5) ? -v : v;
        return fx;
    }
}

export default Shake;