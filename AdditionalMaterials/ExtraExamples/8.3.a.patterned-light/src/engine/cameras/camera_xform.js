/*
 * File: camera_xform.js
 *
 * Adds WC <--> DC transformation support to the Camrea class
 */
"use strict";

import Camera from "./camera_input.js";
import { eViewport } from "./camera_main.js";

Camera.prototype.fakeZInPixelSpace = function (z) {
    return z * this.mRenderCache.mWCToPixelRatio;
}

Camera.prototype.wcPosToPixel = function (p) {  // p is a vec3, fake Z
    // Convert the position to pixel space
    let x = this.mViewport[eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let y = this.mViewport[eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
}

Camera.prototype.wcSizeToPixel = function (s) {  // 
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
}

export default Camera;