/*
 * File: camera_manipulation.js
 *
 * Adds the manipulation functions to the Camera class
 */
"use strict";

import Camera from "./camera_main.js";
import { eBoundCollideStatus } from "../bounding_box.js";

// pan the camera to ensure aXform is within camera bounds
// this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
Camera.prototype.panWith = function (aXform, zone) {
    let status = this.collideWCBound(aXform, zone);
    if (status !== eBoundCollideStatus.eInside) {
        let pos = aXform.getPosition();
        let newC = this.getWCCenter();
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
    }
}

Camera.prototype.panBy = function (dx, dy) {
    this.mWCCenter[0] += dx;
    this.mWCCenter[1] += dy;
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
    vec2.sub(delta, pos, this.mWCCenter);
    vec2.scale(delta, delta, zoom - 1);
    vec2.sub(this.mWCCenter, this.mWCCenter, delta);
    this.zoomBy(zoom);
}

export default Camera;