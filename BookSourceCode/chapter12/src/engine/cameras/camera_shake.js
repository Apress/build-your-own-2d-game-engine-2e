/* 
 * File: camera_shake.js
 *  
 * Calls the ShakeVec2 to create the shake effect 
 */
"use strict";

import ShakeVec2 from "../utils/shake_vec2.js";

class CameraShake {
    // state is the CameraState to be shaken
    /**
     * Defines a damped simple harmonic motion to simulate camera shake
     * @param {CameraState} state - the CameraState to be shaken
     * @param {vec2} deltas - the [x,y] magnitudes of the shake
     * @param {float} freqs - the frequency of the shaking in revolutions per cycle
     * @param {float} shakeDuration - the number of cycles for the shaking
     */
    constructor(state, deltas, freqs, shakeDuration) {
        this.mOrgCenter = vec2.clone(state.getCenter());
        this.mShakeCenter = vec2.clone(this.mOrgCenter);
        this.mShake = new ShakeVec2(deltas, freqs, shakeDuration);
    }
    /**
     * Update the shake state of the camera
     * @method
     */
    update() {
        let delta = this.mShake.getNext();
        vec2.add(this.mShakeCenter, this.mOrgCenter, delta);
    }
    /**
     * Returns whether the shake of this CameraShake has completed
     * @method
     * @returns {boolean} true if the shake is done
     */
    done() {
        return this.mShake.done();
    }
    /**
     * Resets the duration of this CameraShake
     * @method
     */
    reShake() {
        this.mShake.reStart();
    }
    /**
     * Returns the world coordinate center of this CameraShake
     * @method
     * @returns {vec2} mShakeCenter - world coordinate center of the Camera
     */
    getCenter() { return this.mShakeCenter; }
    /**
     * Set the center origin reference for this CameraShake
     * @method
     * @param {float[]} c - the x,y world coordinate values to be set
     */
    setRefCenter(c) {
        this.mOrgCenter[0] = c[0];
        this.mOrgCenter[1] = c[1];
    }
}

export default CameraShake;