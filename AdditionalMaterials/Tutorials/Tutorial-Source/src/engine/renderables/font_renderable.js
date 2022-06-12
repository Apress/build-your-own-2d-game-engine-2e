/*
 * File: font_renderable.js
 *
 * Supports the drawing of a string based on a selected Font
 * 
 */

"use strict";

import Transform from "../utils/transform.js";
import SpriteRenderable from "./sprite_renderable.js";
import * as defaultResources from "../resources/default_resources.js";
import * as font from "../resources/font.js";

class FontRenderable {
    /**
     * @classdesc Supports the drawing of a string based on a selected Font
     * <p>Found in Chapter 5, page 253 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.4.font_support/index.html 5.4 Font Support}
     * @constructor
     * @param {string} aString -  the text to render 
     * @returns {FontRenderable} a new FontRenderable instance
     */
    constructor(aString) {
        this.mFontName = defaultResources.getDefaultFontName();
        this.mOneChar = new SpriteRenderable(font.imageName(this.mFontName));
        this.mXform = new Transform(); // transform that moves this object around
        this.mText = aString;
    }
    /**
     * Draw this FontRenderable to the camera
     * @method
     * @param {Camera} camera - the Camera to draw to 
     */
    draw(camera) {
        // we will draw the text string by calling to mOneChar for each of the
        // chars in the mText string.
        let widthOfOneChar = this.mXform.getWidth() / this.mText.length;
        let heightOfOneChar = this.mXform.getHeight();
        // this.mOneChar.getXform().SetRotationInRad(this.mXform.getRotationInRad());
        let yPos = this.mXform.getYPos();

        // center position of the first char
        let xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
        let charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = font.getCharInfo(this.mFontName, aChar);
            
            // set the texture coordinate
            this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
                charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

            // now the size of the char
            xSize = widthOfOneChar * charInfo.mCharWidth;
            ySize = heightOfOneChar * charInfo.mCharHeight;
            this.mOneChar.getXform().setSize(xSize, ySize);

            // how much to offset from the center
            xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
            yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

            this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

            this.mOneChar.draw(camera);

            xPos += widthOfOneChar;
        }
    }

    /**
     * Returns the Transform of this FontRenderable
     * @method
     * @returns {Transform} mXform - the Transform
     */
    getXform() { return this.mXform; }

    /**
     * Returns the text of this FontRenderable
     * @method
     * @returns {string} mText - the text
     */
    getText() { return this.mText; }

    /**
     * Set the text for this FontRenderable
     * @method
     * @param {string} t - the new text 
     */
    setText(t) {
        this.mText = t;
        this.setTextHeight(this.getXform().getHeight());
    }

    /**
     * Set the world coordinate height of the text
     * @method
     * @param {float} h - the new height
     */
    setTextHeight(h) {
        let charInfo = font.getCharInfo(this.mFontName, "A".charCodeAt(0)); // this is for "A"
        let w = h * charInfo.mCharAspectRatio;
        this.getXform().setSize(w * this.mText.length, h);
    }

    /**
     * Returns the path to font being used by this FontRenderable
     * @method
     * @returns {string} mFontName - the path to the resource file
     */
    getFontName() { return this.mFontName; }

    /**
     * Set the path to the font file this FontRenderable uses
     * @method
     * @param {string} f - the path to the font resource file
     */
    setFontName(f) {
        this.mFontName = f;
        this.mOneChar.setTexture(font.imageName(this.mFontName));
    }

    /**
     * Set the color of this FontRenderable
     * @method
     * @param {float[]} c - [R,G,B,A] color array
     */
    setColor(c) { this.mOneChar.setColor(c); }

    /**
     * Returns the color of this FontRenderable
     * @method
     * @returns {float[]} [R,G,B,A] color array
     */
    getColor() { return this.mOneChar.getColor(); }


    update() {}

    /*
     * this can be a potentially useful function. Not included/tested in this version of the engine

    getStringWidth(h) {
        let stringWidth = 0;
        let charSize = h;
        let charIndex, aChar, charInfo;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = font.getCharInfo(this.mFont, aChar);
            stringWidth += charSize * charInfo.mCharWidth * charInfo.mXAdvance;
        }
        return stringWidth;
    }
    */
}

export default FontRenderable;