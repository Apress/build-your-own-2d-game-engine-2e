/* 
 * File: camera_shake.js
 *  
 * Calls the ShakeVec2 to create the shake effect 
 */
"use strict";

import ShakeVec2 from "../utils/shake_vec2.js";

class CameraShake {
    // state is the CameraState to be shaken
    constructor(state, deltas, freqs, shakeDuration) {
        this.mOrgCenter = vec2.clone(state.getCenter());
        this.mShakeCenter = vec2.clone(this.mOrgCenter);
        this.mShake = new ShakeVec2(deltas, freqs, shakeDuration);
    }

    update() {
        let delta = this.mShake.getNext();
        vec2.add(this.mShakeCenter, this.mOrgCenter, delta);
    }

    done() {
        return this.mShake.done();
    }

    reShake() {
        this.mShake.reStart();
    }

    getCenter() { return this.mShakeCenter; }
    setRefCenter(c) {
        this.mOrgCenter[0] = c[0];
        this.mOrgCenter[1] = c[1];
    }
}

export default CameraShake;