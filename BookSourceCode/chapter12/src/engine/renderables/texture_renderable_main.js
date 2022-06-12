/*
 * File: texture_renderable_main.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict"; // Operate in Strict mode such that variables must be declared before used!

import Renderable from "./renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";

class TextureRenderable extends Renderable {

    /**
     * @classdesc Supports the drawing of an entire file texture mapped onto an entire Renderable
     * <p>Found in Chapter 5, page 201 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter5/5.1.texture_shaders/index.html 5.1 Texture Shader}
     * @extends Renderable
     * @constructor
     * @param {string} myTexture - the path to the image file to use as texture
     * @returns {TextureRenderable} a new TextureRenderable instance
     */
    constructor(myTexture) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getTextureShader());
        
        this.mTexture = null;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = null;
        this.mColorArray = null;
        // defined for subclass to override
        this.mElmWidthPixels = 0;
        this.mElmHeightPixels = 0;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;

        this.setTexture(myTexture);     // texture for this object, cannot be a "null"
    }

    /**
     * Draw this TextureRenderable to the camera
     * @method
     * @param {Camera} camera - the Camera to draw this TextureRenderable to draw to
     */
    draw(camera) {
        // activate the texture
        texture.activate(this.mTexture);
        super.draw(camera);
    }

    /**
     * Return the path to image file associated with this TextureRenderable
     * @method
     * @returns {string} mTexture - path to image file
     */
    getTexture() { return this.mTexture; }

    /**
     * Set the image file to serve as the texture for this TextureRenderable
     * @method
     * @param {string} newTexture - path to new image file
     */
    setTexture(newTexture) {
        this.mTexture = newTexture;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = texture.get(newTexture);
        this.mColorArray = null;
        // defined for one sprite element for subclass to override
        // For texture_renderable, one sprite element is the entire texture
        this.mElmWidthPixels = this.mTextureInfo.mWidth;
        this.mElmHeightPixels = this.mTextureInfo.mHeight;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;
    }
}

export default TextureRenderable;