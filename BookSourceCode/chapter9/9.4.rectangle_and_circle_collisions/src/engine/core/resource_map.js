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

let mMap = new Map();
let mOutstandingPromises = [];

function has(path) { return mMap.has(path) }

function set(key, value) { 
    mMap.get(key).set(value);
}

function loadRequested(path) {
    mMap.set(path, new MapEntry(null)); 
}

function incRef(path) {
    mMap.get(path).incRef();
}


// returns the resource of path. An error to if path is not found
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
function unload(path) { 
    let entry = mMap.get(path);
    entry.decRef();
    if (entry.canRemove())
        mMap.delete(path) 
    return entry.canRemove();
}

function pushPromise(p) { mOutstandingPromises.push(p); }

// will block, wait for all outstanding promises complete
// before continue
async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export {has, get, set, loadRequested, incRef, loadDecodeParse, unload, pushPromise, waitOnPromises}