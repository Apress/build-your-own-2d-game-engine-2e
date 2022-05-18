/*
 * File: xml.js
 *
 * logics for loading an xml file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";




// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

let mParser = new DOMParser();

/**
 * Logics for loading an xml file into the resource_map
 * 
 * <p><strong>Exports the unload(), has(), and get() functions from </strong> 
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/AdditionalMaterials/Documentation/module-resource_map.html resource map}</p>
 * 
 * <p>Found in Chapter 4, page 146 of the textbook</p>
 * Examples:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter4/4.4.scene_files/index.html 4.4 Scene File}, 
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter4/4.5.scene_objects/index.html 4.5 Scene Objects}
 * @module xml
 */

/**
 * Returns the text representation of the data
 * @static
 * @ignore
 * @param {} data 
 * @returns {string} the resource as text
 */
function decodeXML(data) {
    return data.text();
}

/**
 * Parses a string into an XMLDocument
 * @static
 * @ignore
 * @param {string} text - the text representation of the resource to parse
 * @returns {XMLDocument} the parsed XMLDocument
 */
function parseXML(text) {
    return mParser.parseFromString(text, "text/xml");
}

/**
 * Load the resource into the resource map
 * @static
 * @param {string} path - the path to the XML to load
 * @returns {Promise} a Promise to load the resource, null if the resource already exists in the map
 */
function load(path) {
    return map.loadDecodeParse(path, decodeXML, parseXML);
}

export {has, get, load, unload}