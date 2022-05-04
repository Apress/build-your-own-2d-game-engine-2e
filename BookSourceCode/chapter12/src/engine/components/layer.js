/*
 * File: layer.js 
 * Central storage for all elements that would be drawn 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObjectSet from "../game_objects/game_object_set.js";


/**
 * Central storage for all GameObjects that are to be drawn. Supports HUD, Foreground, Actor, Shadow Receiver, and Background layers
 * <p>Found in Chapter 11, page 689 of the textbook </p>
 * Example:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter11/11.3.layer_manager/index.html 11.3 Layer Manager}
 * @module layer
 */

// enum values of array offsets

const eBackground = 0;
const eShadowReceiver = 1;
const eActors = 2;
const eFront = 3;
const eHUD = 4;

let kNumLayers = 5;
let mAllLayers = [];

/**
 * Initialize the layers by setting each layer to an empty GameObjectSet
 * @export layer
 * @method
 */
function init() {
    mAllLayers[eBackground] = new GameObjectSet();
    mAllLayers[eShadowReceiver] = new GameObjectSet();
    mAllLayers[eActors] = new GameObjectSet();
    mAllLayers[eFront] = new GameObjectSet();
    mAllLayers[eHUD] = new GameObjectSet();
}

/**
 * Set each layer to an empty GameObjectSet
 * @export layer
 * @method
 */
function cleanUp() {
    init();
}

/**
 * Draw every GameObject on every layer to the Camera
 * @export layer
 * @param {Camera} aCamera - the Camera to draw to
 */
function drawAllLayers(aCamera) {
    let i;
    for (i = 0; i < kNumLayers; i++) {
        mAllLayers[i].draw(aCamera);
    }
}

/**
 * Update every GameObject on every layer
 * @export layer
 * @method
 */
function updateAllLayers() {
    let i;
    for (i = 0; i < kNumLayers; i++) {
        mAllLayers[i].update();
    }
}

// operations on the layers
/**
 * Calls draw() on all the GameObjects in the indexed layer
 * @export layer
 * @param {integer} layerEnum - the layer's index
 * @param {Camera} aCamera - the Camera to draw to
 */
function drawLayer(layerEnum, aCamera) {
    mAllLayers[layerEnum].draw(aCamera);
}

/**
 * Calls update() on all the GameObjects in the indexed layer
 * @export layer
 * @param {integer} layerEnum - the layer's index
 */
function updateLayer(layerEnum) {
    mAllLayers[layerEnum].update();
}

/**
 * Add a GameObject to a layer's list
 * @export layer
 * @param {integer} layerEnum - index of the layer to add to
 * @param {GameObject} obj - GameObject to add
 */
function addToLayer(layerEnum, obj) {
    mAllLayers[layerEnum].addToSet(obj);
}

/**
 * Add a ShadowCaster to each ShadowReciever in the shadow receiver layer
 * @export
 * @param {ShadowCaster} obj - ShadowCaster to add
 */
function addAsShadowCaster(obj) {
    let i;
    for (i = 0; i < mAllLayers[eShadowReceiver].size(); i++) {
        mAllLayers[eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
    }
}

/**
 * Remove a GameObject from the indexed layer
 * @export
 * @param {integer} layerEnum - the index of the layer to access
 * @param {GameObject} obj - GameObject to be removed
 */
function removeFromLayer(layerEnum, obj) {
    mAllLayers[layerEnum].removeFromSet(obj);
}

/**
 * Move a GameObject to the last index of the layer, appending it if not alrady present
 * @export
 * @param {integer} layerEnum - the index of the layer to add to
 * @param {GameObject} obj - GameObject to move to the end
 */
function moveToLayerFront(layerEnum, obj) {
    mAllLayers[layerEnum].moveToLast(obj);
}

/**
 * Returns the number of GameObject in a specified layer
 * @param {integer} layerEnum - index of the layer to access
 * @returns {integer} the number of GameObjects
 */
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