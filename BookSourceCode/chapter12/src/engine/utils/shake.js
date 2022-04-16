/* 
 * File: shake.js
 * randomize oscillate results 
 */
"use strict";

import Oscillate from "./oscillate.js";

class Shake extends Oscillate {
    /**
     * Ocsillate object with randomized sign
     * @constructor
     * @param {float} delta  - the maximum magnitude of the oscillation
     * @param {float} frequency - the frequency of the oscillation in revolutions per cycle
     * @param {integer} duration - the number of cycles the oscillation should take
     * @returns {Shake} a new Shake instance
     */
    constructor(delta, frequency, duration) {
        super(delta, frequency, duration);
    }

    // randomize the sign of the oscillation magnitude
    /**
     * Returns the next oscillation magnitude with random sign
     * @method
     * @returns {float} fx - next oscillation magnitude with random sign
     */
    _nextValue() {
        let v = this._nextDampedHarmonic();
        let fx = (Math.random() > 0.5) ? -v : v;
        return fx;
    }
}

export default Shake;