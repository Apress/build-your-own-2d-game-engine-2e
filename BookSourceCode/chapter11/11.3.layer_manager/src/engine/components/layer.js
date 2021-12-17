/*
 * File: layer.js 
 * Central storage for all elements that would be drawn 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObjectSet from "../game_objects/game_object_set.js";

// enum values of array offsets
const eBackground = 0;
const eShadowReceiver = 1;
const eActors = 2;
const eFront = 3;
const eHUD = 4;

let kNumLayers = 5;
let mAllLayers = [];

function init() {
    mAllLayers[eBackground] = new GameObjectSet();
    mAllLayers[eShadowReceiver] = new GameObjectSet();
    mAllLayers[eActors] = new GameObjectSet();
    mAllLayers[eFront] = new GameObjectSet();
    mAllLayers[eHUD] = new GameObjectSet();
}

function cleanUp() {
    init();
}

function drawAllLayers(aCamera) {
    let i;
    for (i = 0; i < kNumLayers; i++) {
        mAllLayers[i].draw(aCamera);
    }
}

function updateAllLayers() {
    let i;
    for (i = 0; i < kNumLayers; i++) {
        mAllLayers[i].update();
    }
}

// operations on the layers
function drawLayer(layerEnum, aCamera) {
    mAllLayers[layerEnum].draw(aCamera);
}

function updateLayer(layerEnum) {
    mAllLayers[layerEnum].update();
}

function addToLayer(layerEnum, obj) {
    mAllLayers[layerEnum].addToSet(obj);
}

function addAsShadowCaster(obj) {
    let i;
    for (i = 0; i < mAllLayers[eShadowReceiver].size(); i++) {
        mAllLayers[eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
    }
}
function removeFromLayer(layerEnum, obj) {
    mAllLayers[layerEnum].removeFromSet(obj);
}
function moveToLayerFront(layerEnum, obj) {
    mAllLayers[layerEnum].moveToLast(obj);
}
function layerSize(layerEnum) {
    return mAllLayers[layerEnum].size();
}

export {
    // array indices
    eBackground, eShadowReceiver, eActors, eFront, eHUD,
    
    // init and cleanup
    init, cleanUp,

    // draw/update
    drawLayer, drawAllLayers,
    updateLayer, updateAllLayers,

    // layer-specific support
    addToLayer, addAsShadowCaster,
    removeFromLayer, moveToLayerFront,
    layerSize
}