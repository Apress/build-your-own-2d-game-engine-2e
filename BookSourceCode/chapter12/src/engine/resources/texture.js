/*
 * File: texture.js
 *
 * defines the logic for loading and interacting with file texture resources
 * (load into the resource_map)
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import * as map from "../core/resource_map.js";
// functions from resource_map
let has = map.has;
let get = map.get;

/**
 * Defines the logic for loading and interacting with file texture resources
 * 
 * <p><strong>Exports the has() and get() functions from </strong> 
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/AdditionalMaterials/Documentation/module-resource_map.html resource map}</p>
 * 
 * <p>Found in Chapter 5, page 204 of the textbook</p>
 * Example:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter5/5.1.texture_shaders/index.html 5.1 Texture Shaders}
 * @module texture
 */


class TextureInfo {
    /**
     * @classdesc Object for convenient communication of a texture's properties
     * @memberof texture
     * @param {integer} w - the pixel width of the texture 
     * @param {integer} h - the pixel height of the texture
     * @param {gl.TEXTUREI} id - webGL id for the texture
     * @returns {TextureInfo} a new TextureInfo instance
     */
    constructor(w, h, id) {
        this.mWidth = w;
        this.mHeight = h;
        this.mGLTexID = id;
        this.mColorArray = null;
    }
}


/*
 * This converts an image to the webGL texture format. 
 * This should only be called once the texture is loaded.
 */
/**
 * This converts an image to the webGL texture format. 
 * This should only be called once the texture is loaded
 * @export texture
 * @ignore
 * @param {string} path - the path to the image file
 * @param {Image} image - Image object with the image file data
 */
function processLoadedImage(path, image) {
    let gl = glSys.get();

    // Generate a texture reference to the webGL context
    let textureID = gl.createTexture();

    // bind the texture reference with the current texture functionality in the webGL
    gl.bindTexture(gl.TEXTURE_2D, textureID);

    // Load the texture into the texture data structure with descriptive info.
    // Parameters:
    //  1: Which "binding point" or target the texture is being loaded to.
    //  2: Level of detail. Used for mipmapping. 0 is base texture level.
    //  3: Internal format. The composition of each element. i.e. pixels.
    //  4: Format of texel data. Must match internal format.
    //  5: The data type of the texel data.
    //  6: Texture Data.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Creates a mipmap for this texture.
    gl.generateMipmap(gl.TEXTURE_2D);

    // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
    gl.bindTexture(gl.TEXTURE_2D, null);

    let texInfo = new TextureInfo(image.naturalWidth, image.naturalHeight, textureID);
    map.set(path, texInfo);
}

// 
/**
 * Loads a texture into the resource map so that it can be drawn
 * @static
 * @param {string} textureName - the path to the image file
 * @returns {Promise} promise to process the texture
 */
function load(textureName) {
    let texturePromise = null;
    if (map.has(textureName)) {
        map.incRef(textureName);
    } else {
        map.loadRequested(textureName);
        let image = new Image();
        texturePromise = new Promise(
            function (resolve) {
                image.onload = resolve;
                image.src = textureName;
            }).then(
                function resolve() {
                    processLoadedImage(textureName, image);
                }
            );
        map.pushPromise(texturePromise);
    }
    return texturePromise;
}

// Remove the reference to allow associated memory 
// be available for subsequent garbage collection
/**
 * Remove the reference to the texture allow for garbage collection
 * @static
 * @param {string} textureName - the path to the image file
 */
function unload(textureName) {
    let texInfo = get(textureName);
    if (map.unload(textureName)) {
        let gl = glSys.get();
        gl.deleteTexture(texInfo.mGLTexID);
    }
}

/**
 * Activate a texture file within the webGL system
 * @static
 * @param {string} textureName - the path to the image file
 * @param {gl.TEXTUREI} textureUnit - the texture unit to be activated, defaults to TEXTURE0
 */
function activate(textureName, textureUnit = glSys.get().TEXTURE0) {
    let gl = glSys.get();
    let texInfo = get(textureName);

    // Binds our texture reference to the current webGL texture functionality
    gl.activeTexture(textureUnit);  // activate the WebGL texture unit
    gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

    // To prevent texture wrappings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Handles how magnification and minimization filters will work.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    // For pixel-graphics where you want the texture to look "sharp" do the following:
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}
/**
 * Deactivate the webGL texture system
 * @static
 */
function deactivate() {
    let gl = glSys.get();
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Returns the one dimensional array with color information for all pixels
 * @static
 * @param {string} textureName - the path to the image file
 * @returns {Uint8Array} array with color information for all pixels
 */
function getColorArray(textureName) {
    let gl = glSys.get();
    let texInfo = get(textureName);
    if (texInfo.mColorArray === null) {
        // create a framebuffer bind it to the texture, and read the color content
        // Hint from: http://stackoverflow.com/questions/13626606/read-pixels-from-a-webgl-texture 
        let fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
            let pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
            gl.readPixels(0, 0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            texInfo.mColorArray = pixels;
        } else {
            throw new Error("WARNING: Engine.Textures.getColorArray() failed!");
            return null;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);
    }
    return texInfo.mColorArray;
}

export {
    has, get, load, unload,

    TextureInfo,

    activate, deactivate,

    getColorArray
}