/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., fonts
 */
"use strict";

import * as font from "./font.js";
import * as map from "../core/resource_map.js";

// Default font
let kDefaultFont = "assets/fonts/system_default_font";

// unload all resources
function cleanUp() {
    font.unload(kDefaultFont);
}

function init() {
    let loadPromise = new Promise(
        async function (resolve) {
            await Promise.all([
                font.load(kDefaultFont)
            ]);
            resolve();
        }).then(
            function resolve() { /* nothing to do for font */ }
        );
    map.pushPromise(loadPromise);
}

// font
function getDefaultFontName() { return kDefaultFont; }

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName
}