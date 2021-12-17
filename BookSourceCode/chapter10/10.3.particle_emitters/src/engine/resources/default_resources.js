/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., fonts
 */
"use strict";

import * as font from "./font.js";
import * as texture from "../resources/texture.js";
import * as map from "../core/resource_map.js";

// Global Ambient color
let mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
let mGlobalAmbientIntensity = 1;
function getGlobalAmbientIntensity() { return mGlobalAmbientIntensity; }
function setGlobalAmbientIntensity(v) { mGlobalAmbientIntensity = v; }
function getGlobalAmbientColor() { return mGlobalAmbientColor; }
function setGlobalAmbientColor(v) { mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); }

// Default font
let kDefaultFont = "assets/fonts/system_default_font";

// Default particle texture
let kDefaultPSTexture = "assets/particles/particle.png";

// unload all resources
function cleanUp() {
    font.unload(kDefaultFont);
    texture.unload(kDefaultPSTexture);
}

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
function getDefaultFontName() { return kDefaultFont; }
function getDefaultPSTexture() { return kDefaultPSTexture; }

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName, getDefaultPSTexture,

    // Global ambient: intensity and color
    getGlobalAmbientColor, setGlobalAmbientColor, 
    getGlobalAmbientIntensity, setGlobalAmbientIntensity
}