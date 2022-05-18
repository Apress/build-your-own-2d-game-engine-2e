/* 
 * File: shake.js
 * randomize oscillate results 
 */
"use strict";

import Oscillate from "./oscillate.js";

class Shake extends Oscillate {
    /**
     * @classdesc Ocsillate object with randomized sign
     * <p>Found in Chapter 7, page 363 of the textbook</p>
     * Example:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter7/7.3.camera_shake_and_object_oscillate/index.html 7.3 Came Shake and Object Oscillation}
     * @constructor
     * @extends Oscillate
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