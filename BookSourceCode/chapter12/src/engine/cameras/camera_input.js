/*
 * File: camera_input.js
 *
 * Adds functions that support mouse input (transform from DC to WC)
 */
"use strict";

import Camera from "./camera_manipulation.js";
import { eViewport } from "./camera_main.js";
import * as input from "../components/input.js";
/**
 * Return the mouse x position with respect to the viewport origin
 * @memberof Camera
 * @returns {integer} mouse x position
 */
Camera.prototype._mouseDCX = function () {
    return input.getMousePosX() - this.mViewport[eViewport.eOrgX];
}


/**
 * Return the mouse y position with respect to the viewport origin
 * @memberof Camera
 * @returns {integer} mouse y position
 */
Camera.prototype._mouseDCY = function() {
    return input.getMousePosY() - this.mViewport[eViewport.eOrgY];
}

/**
 * Return whether the mouse is within the viewport
 * @memberof Camera
 * @returns {boolean} whether the mouse is within the viewport
 */
Camera.prototype.isMouseInViewport = function () {
    let dcX = this._mouseDCX();
    let dcY = this._mouseDCY();
    return ((dcX >= 0) && (dcX < this.mViewport[eViewport.eWidth]) &&
        (dcY >= 0) && (dcY < this.mViewport[eViewport.eHeight]));
}

/**
 * Return the mouse x world coordinate position
 * @memberof Camera
 * @returns {float} mouse x world coordinate position
 */
Camera.prototype.mouseWCX = function () {
    let minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.mViewport[eViewport.eWidth]));
}

/**
 * Return the mouse y world coordinate position
 * @memberof Camera
 * @returns {float} mouse y world coordinate position
 */
Camera.prototype.mouseWCY = function () {
    let minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this._mouseDCY() * (this.getWCHeight() / this.mViewport[eViewport.eHeight]));
}

export default Camera;