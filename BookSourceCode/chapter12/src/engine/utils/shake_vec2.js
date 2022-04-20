/* 
 * File: shake_vec2.js
 * Shakes a vec2, sub class from Shake (use as y-value) 
 */
"use strict";

import Shake from "./shake.js";

// deltas, and freqs: are vec2
// duration is a float
class ShakeVec2 extends Shake {
    /**
     * Class to model shaking in x and y directions
     * @constructor
     * @extends Shake
     * @param {vec2} deltas - the maximum magnitude of the oscillation
     * @param {vec2} freqs - the frequency of the oscillation in revolutions per cycle
     * @param {integer} duration - the number of cycles the oscillation should take
     * @returns {ShakeVec2} a new ShakeVec2 instance
     */
    constructor(deltas, freqs, duration) {
        super(deltas[1], freqs[1], duration);  // super is shake in y-direction
        this.xShake = new Shake(deltas[0], freqs[0], duration);
    }
    /**
     * Restarts the shake in the x and y directions
     * @method
     */
    reStart() {
        super.reStart();
        this.xShake.reStart();
    }
    /**
     * Returns the next oscillation x and y magnitude with random sign
     * @method
     * @returns {float[]} [x,y] - next x and y oscillation magnitude with random sign
     */
    getNext() {
        let x = this.xShake.getNext();
        let y = super.getNext();
        return [x, y];
    }
}

export default ShakeVec2;