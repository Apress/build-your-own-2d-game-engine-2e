/*
 * File: texture_renderable_pixel_collision.js
 *
 * defines functions that are required to support
 * per-pixel accurate collision  for TextureRenderable class
 * 
 */
"use strict";

import TextureRenderable from "./texture_renderable_main.js";
import * as texture from "../resources/texture.js";



// the following are support for per-pixel collision
TextureRenderable.prototype.pixelTouches = function (other, wcTouchPos) {
    let pixelTouch = false;
    let xIndex = 0, yIndex;
    let otherIndex = [0, 0];

    let xDir = [1, 0];
    let yDir = [0, 1];
    let otherXDir = [1, 0];
    let otherYDir = [0, 1];
    vec2.rotate(xDir, xDir, this.mXform.getRotationInRad());
    vec2.rotate(yDir, yDir, this.mXform.getRotationInRad());
    vec2.rotate(otherXDir, otherXDir, other.mXform.getRotationInRad());
    vec2.rotate(otherYDir, otherYDir, other.mXform.getRotationInRad());

    while ((!pixelTouch) && (xIndex < this.mElmWidthPixels)) {
        yIndex = 0;
        while ((!pixelTouch) && (yIndex < this.mElmHeightPixels)) {
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
                if ((otherIndex[0] >= 0) && (otherIndex[0] < other.mElmWidthPixels) &&
                    (otherIndex[1] >= 0) && (otherIndex[1] < other.mElmHeightPixels)) {
                    pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
}

TextureRenderable.prototype.setColorArray = function () {
    if (this.mColorArray === null) {
        this.mColorArray = texture.getColorArray(this.mTexture);
    }
}

TextureRenderable.prototype._pixelAlphaValue = function (x, y) {
    y += this.mElmBottomIndex;
    x += this.mElmLeftIndex;
    x = x * 4;
    y = y * 4;
    return this.mColorArray[(y * this.mTextureInfo.mWidth) + x + 3];
}

TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    let delta = [];
    vec2.sub(delta, wcPos, this.mXform.getPosition());
    let xDisp = vec2.dot(delta, xDir);
    let yDisp = vec2.dot(delta, yDir);
    returnIndex[0] = this.mElmWidthPixels * (xDisp / this.mXform.getWidth());
    returnIndex[1] = this.mElmHeightPixels * (yDisp / this.mXform.getHeight());

    // recall that xForm.getPosition() returns center, yet
    // Texture origin is at lower-left corner!
    returnIndex[0] += this.mElmWidthPixels / 2;
    returnIndex[1] += this.mElmHeightPixels / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
}

TextureRenderable.prototype._indexToWCPosition = function (returnWCPos, i, j, xDir, yDir) {
    let x = i * this.mXform.getWidth() / this.mElmWidthPixels;
    let y = j * this.mXform.getHeight() / this.mElmHeightPixels;
    let xDisp = x - (this.mXform.getWidth() * 0.5);
    let yDisp = y - (this.mXform.getHeight() * 0.5);
    let xDirDisp = [];
    let yDirDisp = [];

    vec2.scale(xDirDisp, xDir, xDisp);
    vec2.scale(yDirDisp, yDir, yDisp);
    vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
}

export default TextureRenderable;