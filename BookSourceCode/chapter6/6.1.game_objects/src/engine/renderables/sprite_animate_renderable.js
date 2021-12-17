/*
 * File: sprite_animate_renderable.js
 *
 * Supports the drawing and controlling of sprite animation sequence
 * 
 */
"use strict";

import SpriteRenderable from "./sprite_renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";

// Assumption is that the first sprite in an animation is always the left-most element.
const eAnimationType = Object.freeze({
    eRight: 0,     // Animate from first (left) towards right, when hit the end, start from the left again
    eLeft: 1,      // Compute find the last element (in the right), start from the right animate left-wards, 
    eSwing: 2      // Animate from first (left) towards the right, when hit the end, animates backwards 
});

class SpriteAnimateRenderable extends SpriteRenderable {
    constructor(myTexture) {
        super(myTexture);
        super._setShader(shaderResources.getSpriteShader());

        // All coordinates are in texture coordinate (UV between 0 to 1)
        // Information on the sprite element 
        this.mFirstElmLeft = 0.0; // 0.0 is left corner of image
        this.mElmTop = 1.0;  // 1.0 is top corner of image (from SpriteRenderable)
        this.mElmWidth = 1.0;     
        this.mElmHeight = 1.0;
        this.mWidthPadding = 0.0;
        this.mNumElems = 1;   // number of elements in an animation

        //
        // per animation settings
        this.mUpdateInterval = 1;   // how often to advance
        this.mAnimationType = eAnimationType.eRight;

        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._initAnimation();
    }

    _initAnimation() {
        // Currently running animation
        this.mCurrentTick = 0;
        switch (this.mAnimationType) {
        case eAnimationType.eRight:
            this.mCurrentElm = 0;
            this.mCurrentAnimAdvance = 1; // either 1 or -1
            break;
        case eAnimationType.eSwing:
            this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance; // swings ... 
            this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
            break;
        case eAnimationType.eLeft:
            this.mCurrentElm = this.mNumElems - 1;
            this.mCurrentAnimAdvance = -1; // either 1 or -1
            break;
        }
        this._setSpriteElement();
    }

    _setSpriteElement() {
        let left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));
        super.setElementUVCoordinate(left, left + this.mElmWidth,
                               this.mElmTop - this.mElmHeight, this.mElmTop);
    }

    // Always set the left-most element to be the first
    setSpriteSequence(
        topPixel,   // offset from top-left
        leftPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements,      // number of elements in sequence
        wPaddingInPixel  // left/right padding
    ) {
        let texInfo = texture.get(this.mTexture);
        // entire image width, height
        let imageW = texInfo.mWidth;
        let imageH = texInfo.mHeight;

        this.mNumElems = numElements;   // number of elements in animation
        this.mFirstElmLeft = leftPixel / imageW;
        this.mElmTop = topPixel / imageH;
        this.mElmWidth = elmWidthInPixel / imageW;
        this.mElmHeight = elmHeightInPixel / imageH;
        this.mWidthPadding = wPaddingInPixel / imageW;
        this._initAnimation();
    }

    setAnimationSpeed(
        tickInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval = tickInterval;   // how often to advance
    }

   incAnimationSpeed(
        deltaInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval += deltaInterval;   // how often to advance
    }

    setAnimationType(animationType) {
        this.mAnimationType = animationType;
        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._initAnimation();
    }

    updateAnimation() {
        this.mCurrentTick++;
        if (this.mCurrentTick >= this.mUpdateInterval) {
            this.mCurrentTick = 0;
            this.mCurrentElm += this.mCurrentAnimAdvance;
            if ((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems)) {
                this._setSpriteElement();
            } else {
                this._initAnimation();
            }
        }
    }
}

export {eAnimationType}
export default SpriteAnimateRenderable;