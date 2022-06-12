/*
 * File: text.js
 *
 * logics for loading a text file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";

/**
 * Logics for loading a text file into the resource_map
 * <p><strong>Exports the unload(), has(), and get() functions from </strong> 
 * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/AdditionalMaterials/Documentation/module-resource_map.html resource map}</p>
 * 
 * <p>Found in Chapter, page 138 of the textbook </p>
 * 
 * Example:
 * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter4/4.3.resource_map_and_shader_loader/index.html 4.3 Resource Map and Shader Loader}
 * @module text
 */

// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

/**
 * Decode the data into text, used in loading
 * @ignore
 * @param {} data - the data of the text file
 * @returns {string} the text representation of the data
 */
function decodeText(data) {
    return data.text();
}

/**
 * Returns the text that is passed in, used in loading
 * @ignore
 * @param {string} text - the text representation of the data
 * @returns {string} the text representation of the data
 */
function parseText(text) {
    return text;
}
/**
 * Load the text resource into the resource map
 * @static
 * @param {string} path - path to the text file
 * @returns {Promise} a Promise to load the resource, null if the resource already exists in the map
 */
function load(path) {
    return map.loadDecodeParse(path, decodeText, parseText);
}

export {has, get, load, unload}