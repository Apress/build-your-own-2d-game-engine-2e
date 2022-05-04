/*
 * File: font.js
 *
 * logics for loading font into the resource_map
 * Note that "font" consists of two files
 *    => the bitmap font image
 *    => the associated xml descriptor file
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as texture from "./texture.js";
import * as xml from "./xml.js";

/**
 * Logics for loading font into the resource_map,
 * note that "font" consists of two files: the bitmap font image and the associated xml descriptor file
 * <p>Found in Chapter 5, page 245 of the textbook</p> 
 * Example:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter5/5.4.font_support/index.html 5.4 Font Support}
 * @module font 
 */


let kImageExt = ".png";  // extension for the bitmap font image
let kDescExt = ".fnt";   // extension for the bitmap font description


// for convenient communication of per-character information
// all size returned are in normalize unit (range between 0 to 1)
class CharacterInfo {
    /**
     * @classdesc Object for convenient communication of per-character information,
     * all size returned are in normalize unit (range between 0 to 1)
     * @returns {CharacterInfo} a new CharacterInfo instance
     */
    constructor() {
        // in texture coordinate (0 to 1) maps to the entire image
        this.mTexCoordLeft = 0;
        this.mTexCoordRight = 1;
        this.mTexCoordBottom = 0;
        this.mTexCoordTop = 0;

        // reference to nominal character size, 1 is "standard width/height" of a char
        this.mCharWidth = 1;
        this.mCharHeight = 1;
        this.mCharWidthOffset = 0;
        this.mCharHeightOffset = 0;

        // reference of char width/height ratio
        this.mCharAspectRatio = 1;
    }
}

/**
 * Returns the fontName with ".png" appened
 * @static
 * @param {string} fontName - the path to the font files
 * @returns {string} fontName with file extension
 */
function imageName(fontName) { return fontName+kImageExt;}
/**
 * Returns the path of the font description file with ".fnt" appened
 * @static
 * @param {string} fontName - the path to the font files
 * @returns {string} path to font description file
 */
function descName(fontName) { return fontName+kDescExt;}

/**
 * Load the font image as a texture and the font description as an XMLDocument
 * @static
 * @param {string} fontName - path to the font image and description files
 */
function load(fontName) {
    texture.load(imageName(fontName));
    xml.load(descName(fontName));
}

// Remove the reference to allow associated memory 
// be available for subsequent garbage collection
/**
 * Unload the font to allow for garbage collection
 * @static
 * @param {string} fontName - path to the font image and description files
 */
function unload(fontName) {
    texture.unload(imageName(fontName));
    xml.unload(descName(fontName));
}

/**
 * Returns whether the font is already in the resource map
 * @static
 * @param {string} fontName - path to the font image and description files
 * @returns {boolean} true if the font image and font description are loaded
 */
function has(fontName) {
    return texture.has(imageName(fontName)) && xml.has(descName(fontName));
}

/**
 * Returns a CharacterInfo object with the size and texel information for the character texture
 * @static
 * @param {string} fontName - path to the font image and description files
 * @param {string} aChar - the single character (code) to get information for
 * @returns {CharacterInfo} a new instance of CharacterInfo, null if unsuccessful
 */
function getCharInfo(fontName, aChar) {
    let returnInfo = null;
    let fontInfo = xml.get(descName(fontName));
    let commonPath = "font/common";
    let commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    commonInfo = commonInfo.iterateNext();
    if (commonInfo === null) {
        return returnInfo;
    }
    let charHeight = commonInfo.getAttribute("base");

    let charPath = "font/chars/char[@id=" + aChar + "]";
    let charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    charInfo = charInfo.iterateNext();

    if (charInfo === null) {
        return returnInfo;
    }

    returnInfo = new CharacterInfo();
    let texInfo = texture.get(imageName(fontName));
    let leftPixel = Number(charInfo.getAttribute("x"));
    let rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
    let topPixel = (texInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
    let bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

    // texture coordinate information
    returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
    returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

    // relative character size
    let charWidth = charInfo.getAttribute("xadvance");
    returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
    returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
    returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
    returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
    returnInfo.mCharAspectRatio = charWidth / charHeight;

    return returnInfo;
}

export {has, load, unload,

    imageName, descName,

    CharacterInfo,

    getCharInfo
}