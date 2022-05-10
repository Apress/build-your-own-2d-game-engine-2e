/*
 * File: sprite_animate_renderable.js
 *
 * Supports the drawing and controlling of sprite animation sequence
 * 
 */
"use strict";

import SpriteRenderable from "./sprite_renderable.js";
import * as shaderResources from "../core/shader_resources.js";



/**
 * Enum for direction of the animation sequence.
 * Assumption is that the first sprite in an animation is always the left-most element
 * @memberof SpriteAnimateRenderable
 */
const eAnimationType = Object.freeze({
    eRight: 0,     // Animate from first (left) towards right, when hit the end, start from the left again
    eLeft: 1,      // Compute find the last element (in the right), start from the right animate left-wards, 
    eSwing: 2      // Animate from first (left) towards the right, when hit the end, animates backwards 
});

class SpriteAnimateRenderable extends SpriteRenderable {
    /**
     * @classdesc Supports the drawing and controlling of sprite animation sequence.
     * Default animation type is from left to right.
     * <p>Found in Chapter 5, page 236 of the textbook </p>
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.2.sprite_shaders/index.html 5.2 Sprite Shaders},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.3.sprite_animate_shaders/index.html 5.3 Sprite Animation}
     * @extends SpriteRenderable
     * @constructor
     * @param {string} myTexture - path to the sprite sheet image file for this SpriteAnimateRenderable
     */
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
    /**
     * Set the sequence of sprite elements that make up the animation for this SpriteAnimateRenderable
     * @method
     * @param {integer} topPixel - vertical pixel offset from the top-left of the sprite sheet
     * @param {integer} leftPixel - horizontal pixel offset from the top-left of the sprite sheet
     * @param {integer} elmWidthInPixel - pixel width of an individual sprite element in the sequence
     * @param {integer} elmHeightInPixel - pixel height of an individual sprite element in the sequence
     * @param {integer} numElements - number of sprites in the animation sequence
     * @param {integer} wPaddingInPixel - number of horizontal padding pixels between elements
     */
    setSpriteSequence(
        topPixel,   // offset from top-left
        leftPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements,      // number of elements in sequence
        wPaddingInPixel  // left/right padding
    ) {
        // entire image width, height
        let imageW = this.mTextureInfo.mWidth;
        let imageH = this.mTextureInfo.mHeight;

        this.mNumElems = numElements;   // number of elements in animation
        this.mFirstElmLeft = leftPixel / imageW;
        this.mElmTop = topPixel / imageH;
        this.mElmWidth = elmWidthInPixel / imageW;
        this.mElmHeight = elmHeightInPixel / imageH;
        this.mWidthPadding = wPaddingInPixel / imageW;
        this._initAnimation();
    }

    /**
     * Set how many update calls before advancing the animation of this SpriteAnimateRenderable
     * @method
     * @param {integer} tickInterval - animation advancement interval
     */
    setAnimationSpeed(
        tickInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval = tickInterval;   // how often to advance
    }

    /**
     * Add a value to the animation advancement interval
     * @method
     * @param {integer} deltaInterval - the value to add to the advancement interval
     */
   incAnimationSpeed(
        deltaInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval += deltaInterval;   // how often to advance
    }

    /**
     * Set the animation type for this SpriteAnimateRenderable and restart the animation
     * @method
     * @param {eAnimationType} animationType - methodology for moving through the sprite sequence
     */
    setAnimationType(animationType) {
        this.mAnimationType = animationType;
        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._initAnimation();
    }

    /**
     * Update this SpriteAnimatedRenderable, advancing the current sprite element if the update interval has passed
     * @method
     */
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