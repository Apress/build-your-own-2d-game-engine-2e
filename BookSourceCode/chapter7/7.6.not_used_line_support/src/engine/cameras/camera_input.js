/*
 * File: camera_input.js
 *
 * Adds functions to the Camrea class to  support mouse input (transform from DC to WC)
 */
"use strict";

import Camera from "./camera_manipulation.js";
import { eViewport } from "./camera_main.js";
import * as input from "../input.js";

Camera.prototype._mouseDCX = function () {
    return input.getMousePosX() - this.mViewport[eViewport.eOrgX];
}

Camera.prototype._mouseDCY = function() {
    return input.getMousePosY() - this.mViewport[eViewport.eOrgY];
}

Camera.prototype.isMouseInViewport = function () {
    let dcX = this._mouseDCX();
    let dcY = this._mouseDCY();
    return ((dcX >= 0) && (dcX < this.mViewport[eViewport.eWidth]) &&
        (dcY >= 0) && (dcY < this.mViewport[eViewport.eHeight]));
}

Camera.prototype.mouseWCX = function () {
    let minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.mViewport[eViewport.eWidth]));
}

Camera.prototype.mouseWCY = function () {
    let minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this._mouseDCY() * (this.getWCHeight() / this.mViewport[eViewport.eHeight]));
}

export default Camera;