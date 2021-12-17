/*
 * File: camera_manipulation.js
 *
 * Adds the manipulation functions to the Camera class
 */
"use strict";

import Camera from "./camera_main.js"
import { eBoundCollideStatus } from "../utils/bounding_box.js";
import CameraShake from "./camera_shake.js";

Camera.prototype.update = function () {
    if (this.mCameraShake !== null) {
        if (this.mCameraShake.done()) {
            this.mCameraShake = null;
        } else {
            this.mCameraShake.setRefCenter(this.getWCCenter());
            this.mCameraShake.update();
        }
    }
    this.mCameraState.update();
}

// For LERP function configuration
Camera.prototype.configLerp = function (stiffness, duration) {
    this.mCameraState.config(stiffness, duration);
}

// Define camera shake
Camera.prototype.shake = function (deltas, freqs, duration) {
    this.mCameraShake = new CameraShake(this.mCameraState, deltas, freqs, duration);
}

// Restart the shake
Camera.prototype.reShake = function () {
    let success = (this.mCameraShake !== null);
    if (success)
        this.mCameraShake.reShake();
    return success;
}

// pan the camera to ensure aXform is within camera bounds
// this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
Camera.prototype.panWith = function (aXform, zone) {
    let status = this.collideWCBound(aXform, zone);
    if (status !== eBoundCollideStatus.eInside) {
        let pos = aXform.getPosition();
        let newC = vec2.clone(this.getWCCenter());
        if ((status & eBoundCollideStatus.eCollideTop) !== 0) {
            newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
        }
        if ((status & eBoundCollideStatus.eCollideBottom) !== 0) {
            newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
        }
        if ((status & eBoundCollideStatus.eCollideRight) !== 0) {
            newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
        }
        if ((status & eBoundCollideStatus.eCollideLeft) !== 0) {
            newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
        }
        this.mCameraState.setCenter(newC);
    }
}

Camera.prototype.panBy = function (dx, dy) {
    let newC = vec2.clone(this.getWCCenter());
    newC[0] += dx;
    newC[1] += dy;
    this.mCameraState.setCenter(newC);
}

Camera.prototype.panTo = function (cx, cy) {
    this.setWCCenter(cx, cy);
}

// zoom with respect to the center
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.zoomBy = function (zoom) {
    if (zoom > 0) {
        this.setWCWidth(this.getWCWidth() * zoom);
    }
}

// zoom towards (pX, pY) by zoom: 
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.zoomTowards = function (pos, zoom) {
    let delta = [];
    let newC = [];
    vec2.sub(delta, pos, this.getWCCenter());
    vec2.scale(delta, delta, zoom - 1);
    vec2.sub(newC, this.getWCCenter(), delta);
    this.zoomBy(zoom);
    this.mCameraState.setCenter(newC);
}

export default Camera;