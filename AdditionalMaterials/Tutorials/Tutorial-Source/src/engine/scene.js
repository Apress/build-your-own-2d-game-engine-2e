/*
 * File: scene.js
 *
 * The template for a scene.
 * 
 */
"use strict";

import * as loop from "./core/loop.js";
import engine from "./index.js";

const kAbstractClassError = new Error("Abstract Class")
const kAbstractMethodError = new Error("Abstract Method")

class Scene {
    /**
     * @classdesc Template for a scene, must be overriden by user extened scenes
     * <p>Found in Chapter 4, page 157 of the textbook </p>
     * Example:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter4/4.5.scene_objects/index.html 4.5 Scene Objects}
     * @constructor
     * @returns {Scene} a new Scene instance
     */
    constructor() {
        if (this.constructor === Scene) {
            throw kAbstractClassError;
        }
    }
    /**
     * Asynchronous method to start this scene in accordance with the GameLoop
     * @method
     */
    async start() {
        await loop.start(this);
    }

    // expected to be over-written, and, 
    // subclass MUST call 
    //      super.next()
    // to stop the loop and unload the level
    /**
     * Stop the GameLoop and unload this Scene,
     * Subclasses must call super.next()
     * @method
     */
    next() {
        loop.stop();
        this.unload();
    }

    /**
     * Stop the GameLoop, unload this Scene, and call engine.cleanUp()
     * @method
     */
    stop() {
        loop.stop();
        this.unload();
        engine.cleanUp();
    }

    /**
     * To initialize the level, called from loop.start(),
     * should be overriden by subclass
     * @method
     */
    init() { /* to initialize the level (called from loop.start()) */ }

    /**
     * Load the necessary resources,
     * should be overriden by subclass
     * @method
     */
    load() { /* to load necessary resources */ }

    /**
     * Unload all the loaded resources,
     * should be overriden by subclass
     * @method
     * 
     */
    unload() { /* unload all resources */ }
    // draw/update must be over-written by subclass
    /**
     * Draw this Scene to the camera, 
     * must be overriden by subclass
     * @method
     */
    draw() { throw kAbstractMethodError; }
    /**
     * Update this Scene,
     * must be overriden by subclass
     * @method
     */
    update() { throw kAbstractMethodError; }

}

export default Scene;