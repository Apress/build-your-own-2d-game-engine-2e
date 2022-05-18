/*
 * File: resource_map.js
 *  
 * base module for managing storage and synchronization of all resources
 * 
 */
"use strict";

class MapEntry {
    constructor(data) {
        this.mData = data;
        this.mRefCount = 1;
    }
    decRef() { this.mRefCount--; }
    incRef() { this. mRefCount++; }

    set(data) { this.mData = data;}
    data() { return this.mData; }

    canRemove() { return (this.mRefCount == 0); }
}

/**
 * Base module for managing storage and synchronization of all resources
 * <p>Found in Chapter 4, page 134 of the textbook </p>
 * Example:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter4/4.3.resource_map_and_shader_loader/index.html 4.3 Resource Map and Shader Loader}
 * @module resource_map
 */

let mMap = new Map();
let mOutstandingPromises = [];

/**
 * Returns if the resource is in the resource map
 * @export resource_map
 * @param {string} path - path to resource file
 * @returns {boolean} true if the resource is in the resource map
 */
function has(path) { return mMap.has(path) }

/**
 * Sets the data of the MapEntry object for the resource key.
 * The path must already exist in the map
 * @export resource_map
 * @param {string} key - path to the resource file 
 * @param {} value - the data of the resource
 */
function set(key, value) { 
    mMap.get(key).set(value);
}

/**
 * Clears the MapEntry for the resource to be loaded
 * @export resource_map
 * @param {string} path - the path to resource file 
 */
function loadRequested(path) {
    mMap.set(path, new MapEntry(null)); 
}

/**
 * Increment the number of references to a resource
 * @export resource_map
 * @param {string} path -  the resource to increment 
 */
function incRef(path) {
    mMap.get(path).incRef();
}


// returns the resource of path. An error to if path is not found
/**
 * Returns the data of the resource
 * @export resource_map
 * @param {string} path - the path to the resource file
 * @returns {} the data of the resource
 */
function get(path) {
    if (!has(path)) {
        throw new Error("Error [" + path + "]: not loaded");
    }
    return mMap.get(path).data();
}


/**
 * Generic loading function, 
 * Step 1: fetch from server
 * Step 2: decodeResource on the loaded package
 * Step 3: parseResource on the decodedResource
 * Step 4: store result into the map
 * Push the promised operation into an array
 * @export resource_map
 * @param {string} path -  the path to the resource file 
 * @param {function} decodeResource - function to decode resource, specific to the type of resource
 * @param {function} parseResource - function to parse resource, specific to the type of resource
 * @returns {Promise} promise to fetch the resource, null if the resource already exists in the map
 */
function loadDecodeParse(path, decodeResource, parseResource) {
    let fetchPromise = null;
    if (!has(path)) {
        loadRequested(path);
        fetchPromise =  fetch(path)
            .then(res => decodeResource(res) )
            .then(data => parseResource(data) )
            .then(data => { return set(path, data) } )
            .catch(err => { throw err });
        pushPromise(fetchPromise);
    } else {
        incRef(path);  // increase reference count
    }
    return fetchPromise;
}

// returns true if unload is successful
/**
 * Decrements the number of references to a resource, removing it 
 * from the resource map if there are no remaining references
 * @export resource_map
 * @param {string} path - the path to the resource file to be unloaded
 * @returns {boolean} true if unloading is successful
 */
function unload(path) { 
    let entry = mMap.get(path);
    entry.decRef();
    if (entry.canRemove())
        mMap.delete(path) 
    return entry.canRemove();
}

/**
 * Add a new promise to outstanding promise list
 * @export resource_map
 * @param {Promise} p - the new promise  
 */
function pushPromise(p) { mOutstandingPromises.push(p); }

// will block, wait for all outstanding promises complete
// before continue

/**
 * Halt until all outstanding promises are fulfilled
 * @export resource_map
 */
async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export {has, get, set, loadRequested, incRef, loadDecodeParse, unload, pushPromise, waitOnPromises}