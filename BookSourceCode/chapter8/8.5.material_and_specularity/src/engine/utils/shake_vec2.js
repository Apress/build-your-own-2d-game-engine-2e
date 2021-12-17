/* 
 * File: shake_vec2.js
 * Shakes a vec2, sub class from Shake (use as y-value) 
 */
"use strict";

import Shake from "./shake.js";

// deltas, and freqs: are vec2
// duration is a float
class ShakeVec2 extends Shake {
    constructor(deltas, freqs, duration) {
        super(deltas[1], freqs[1], duration);  // super is shake in y-direction
        this.xShake = new Shake(deltas[0], freqs[0], duration);
    }

    reStart() {
        super.reStart();
        this.xShake.reStart();
    }

    getNext() {
        let x = this.xShake.getNext();
        let y = super.getNext();
        return [x, y];
    }
}

export default ShakeVec2;