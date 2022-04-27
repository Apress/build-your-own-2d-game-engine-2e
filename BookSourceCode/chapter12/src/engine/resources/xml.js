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
 * @module xml
 */

/**
 * Returns the text representation of the data
 * @export xml
 * @param {} data 
 * @returns {string} the resource as text
 */
function decodeXML(data) {
    return data.text();
}

/**
 * Parses a string into an XMLDocument
 * @export xml
 * @param {string} text - the text representation of the resource to parse
 * @returns {XMLDocument} the parsed XMLDocument
 */
function parseXML(text) {
    return mParser.parseFromString(text, "text/xml");
}

/**
 * Load the resource into the resource map
 * @export xml
 * @param {string} path - the path to the XML to load
 * @returns {Promise} a Promise to load the resource, null if the resource already exists in the map
 */
function load(path) {
    return map.loadDecodeParse(path, decodeXML, parseXML);
}

export {has, get, load, unload}