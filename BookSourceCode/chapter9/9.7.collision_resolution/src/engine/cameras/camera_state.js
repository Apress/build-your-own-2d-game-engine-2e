/* 
 * File: camera_state.js
 * Defines the state of a camera to facilitate the manipulation of this state
 */
"use strict";

import Lerp from "../utils/lerp.js";
import LerpVec2 from "../utils/lerp_vec2.js";

class CameraState {
    //
    constructor(center, width) {
        this.kCycles = 300;  // number of cycles to complete the transition
        this.kRate = 0.1;  // rate of change for each cycle
        this.mCenter = new LerpVec2(center, this.kCycles, this.kRate);
        this.mWidth = new Lerp(width, this.kCycles, this.kRate);
    }

    getCenter() { return this.mCenter.get(); }
    getWidth() { return this.mWidth.get(); }

    setCenter(c) { this.mCenter.setFinal(c); }
    setWidth(w) { this.mWidth.setFinal(w); }

    update() {
        this.mCenter.update();
        this.mWidth.update();
    }

    config(stiffness, duration) {
        this.mCenter.config(stiffness, duration);
        this.mWidth.config(stiffness, duration);
    }
}

export default CameraState;