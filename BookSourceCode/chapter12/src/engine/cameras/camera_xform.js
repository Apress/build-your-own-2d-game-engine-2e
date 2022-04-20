/*
 * File: camera_xform.js
 *
 * Adds WC <--> DC transformation support to the Camrea class
 */
"use strict";

import Camera from "./camera_input.js";
import { eViewport } from "./camera_main.js";


/**
 * Return a fake z world coordinate converted to pixel space
 * @memberof Camera
 * @param {float} z - value to scale with pixel ratio
 * @returns {float} fake z position in pixel space
 */
Camera.prototype.fakeZInPixelSpace = function (z) {
    return z * this.mRenderCache.mWCToPixelRatio;
}
/**
 * Return a point in world coordinates converted to pixel space
 * @memberof Camera
 * @param {vec3} p - vec3 position, fake z  
 * @returns {vec3} [x,y,z] in pixel space 
 */
Camera.prototype.wcPosToPixel = function (p) {  // p is a vec3, fake Z
    // Convert the position to pixel space
    let x = this.mViewport[eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let y = this.mViewport[eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
}
/**
 * Return a direction in world coordinates converted to pixel space
 * @memberof Camera
 * @param {vec3} d - world coordinate direction 
 * @returns {vec3} [x,y,z] direction in pixel space
 */
Camera.prototype.wcDirToPixel = function (d) {  // d is a vec3 direction in WC
    // Convert the position to pixel space
    let x = d[0] * this.mRenderCache.mWCToPixelRatio;
    let y = d[1] * this.mRenderCache.mWCToPixelRatio;
    let z = d[2];
    return vec3.fromValues(x, y, z);
}
/**
 * Convert a size in world coordinates to a number pixels
 * @memberof Camera
 * @param {float} s - size in world coordinates
 * @returns {float} the number of pixels
 */
Camera.prototype.wcSizeToPixel = function (s) {  // 
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
}

export default Camera;