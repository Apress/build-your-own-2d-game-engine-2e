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
 * @module resource_map
 */

let mMap = new Map();
let mOutstandingPromises = [];

/**
 * Returns if the resource is in the resource map
 * @exports resource_map
 * @param {string} path - path to resource file
 * @returns {boolean} true if the resource is in the resource map
 */
function has(path) { return mMap.has(path) }

/**
 * Sets the MapEntry object for the resource key
 * @exports resource_map
 * @param {string} key - path to the resource file 
 * @param {MapEntry} value - stores information about the resource
 */
function set(key, value) { 
    mMap.get(key).set(value);
}

/**
 * Clears the MapEntry for the resource to be loaded
 * @exports resource_map
 * @param {string} path - the path to resource file 
 */
function loadRequested(path) {
    mMap.set(path, new MapEntry(null)); 
}

/**
 * Increment the number of references to a resource
 * @exports resource_map
 * @param {string} path -  the resource to increment 
 */
function incRef(path) {
    mMap.get(path).incRef();
}


// returns the resource of path. An error to if path is not found
/**
 * Returns the data of the resource
 * @exports resource_map
 * @param {string} path - the path to the resource file
 * @returns {} the resource located by the path
 */
function get(path) {
    if (!has(path)) {
        throw new Error("Error [" + path + "]: not loaded");
    }
    return mMap.get(path).data();
}

// generic loading function, 
//   Step 1: fetch from server
//   Step 2: decodeResource on the loaded package
//   Step 3: parseResource on the decodedResource
//   Step 4: store result into the map
// Push the promised operation into an array
/**
 * Generic loading function, 
 * Step 1: fetch from server
 * Step 2: decodeResource on the loaded package
 * Step 3: parseResource on the decodedResource
 * Step 4: store result into the map
 * Push the promised operation into an array
 * @param {string} path -  the path to the resource file 
 * @param {} decodeResource 
 * @param {} parseResource 
 * @returns {promise} promise to fetch the resource
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
 * @exports resource_map
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
 * @exports resource_map
 * @param {Promise} p - the new promise  
 */
function pushPromise(p) { mOutstandingPromises.push(p); }

// will block, wait for all outstanding promises complete
// before continue

/**
 * Halt until all outstanding promises are fulfilled
 * @exports resource_map
 */
async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export {has, get, set, loadRequested, incRef, loadDecodeParse, unload, pushPromise, waitOnPromises}