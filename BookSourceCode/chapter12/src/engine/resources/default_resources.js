/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., fonts
 */
"use strict";

import * as font from "./font.js";
import * as texture from "../resources/texture.js";
import * as map from "../core/resource_map.js";

/**
 * Central storage of all engine-wide shared resources
 * @module default_resources
 */

// Global Ambient color
let mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
let mGlobalAmbientIntensity = 1;

/**
 * Returns the global ambient light intensity
 * @exports default_resources
 * @returns {float} mGlobalAmbientIntensity - light intensity value
 */
function getGlobalAmbientIntensity() { return mGlobalAmbientIntensity; }
/**
 * Set the global ambient light intensity
 * @exports default_resources
 * @param {float} v - new light insensity value
 */
function setGlobalAmbientIntensity(v) { mGlobalAmbientIntensity = v; }

/**
 * Returns the global ambient color
 * @exports default_resources
 * @returns {float[]} mGlobalAmbientColor - [R,G,B,A] color array
 */
function getGlobalAmbientColor() { return mGlobalAmbientColor; }
/**
 * Set the global ambient color
 * @exports default_resources
 * @param {float[]} v - new [R,G,B,A] color array 
 */
function setGlobalAmbientColor(v) { mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); }

// Default font
let kDefaultFont = "assets/fonts/system_default_font";

// Default particle texture
let kDefaultPSTexture = "assets/particles/particle.png";

// unload all resources
/**
 * Unload the default font and particle texture
 * @exports default_resources
 */
function cleanUp() {
    font.unload(kDefaultFont);
    texture.unload(kDefaultPSTexture);
}


/**
 * Initializes the resources using promises and add them to the resource map
 * @exports default_resources
 */
function init() {
    let loadPromise = new Promise(
        async function (resolve) {
            await Promise.all([
                font.load(kDefaultFont),
                texture.load(kDefaultPSTexture)
            ]);
            resolve();
        }).then(
            function resolve() { /* nothing to do for font */ }
        );
    map.pushPromise(loadPromise);
}

// font
/**
 * Returns the path to the default font
 * @exports default_resources
 * @returns  {string} kDefaultFont - path to default font
 */
function getDefaultFontName() { return kDefaultFont; }

/**
 * Returns the path to the default particle texture
 * @exports default_resources
 * @returns  {string} kDefaultPSTexture - path to default particle texture
 */
function getDefaultPSTexture() { return kDefaultPSTexture; }

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName, getDefaultPSTexture,

    // Global ambient: intensity and color
    getGlobalAmbientColor, setGlobalAmbientColor, 
    getGlobalAmbientIntensity, setGlobalAmbientIntensity
}