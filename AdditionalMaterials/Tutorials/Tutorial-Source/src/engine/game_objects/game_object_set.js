/*
 * File: game_object_set.js
 *
 * utility class for a collection of GameObject
 * 
 */
"use strict";

class GameObjectSet {
    /**
     * @classdesc Utility class for a collection of GameObjects
     * <p>Found in Chapter 6, page 272 in the textbook</p>
     * Example:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter6/6.1.game_objects/index.html 6.1 Game Objects}
     * @constructor
     */
    constructor() {
        this.mSet = [];
    }
    /**
     * Returns the number of GameObjects contained in this GameObjectSet
     * @method
     * @returns {integer} the length of this set
     */
    size() { return this.mSet.length; }

    /**
     * Returns the GameObject at a specified index of this GameObjectSet
     * @method
     * @param {integer} index - the set index to access
     * @returns {GameObject} GameObject at the specified index
     */
    getObjectAt(index) {
        return this.mSet[index];
    }

    /**
     * Adds an GameObject to this GameObjectSet
     * @method
     * @param {GameObject} obj - GameObject to add to the set
     */
    addToSet(obj) {
        this.mSet.push(obj);
    }

    /**
     * Remove an GameObject from this GameObjectSet if present
     * @method
     * @param {GameObject} obj - the GameObject to be removed
     */
    removeFromSet(obj) {
        let index = this.mSet.indexOf(obj);
        if (index > -1)
            this.mSet.splice(index, 1);
    }

    /**
     * Adds the GameObject to the end of set, removing it if already present
     * @method
     * @param {GameObject} obj - the GameObject to be appened
     */
    moveToLast(obj) {
        this.removeFromSet(obj);
        this.addToSet(obj);
    }
    
    /**
     * Calls update on each GameObject in this set
     * @method
     */
    update() {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update();
        }
    }
    /**
     * Calls draw on each GameObject in this GameObjectSet
     * @method
     * @param {aCamera} aCamera - the Camera to be drawn to
     */
    draw(aCamera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].draw(aCamera);
        }
    }

    /**
     * Toggles the drawing of each renderable in this GameObjectSet
     * @method
     */
    toggleDrawRenderable() {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].toggleDrawRenderable();
        }
    }
     /**
     * Toggles the drawing of each rigidShape in this GameObjectSet
     * @method
     */
    toggleDrawRigidShape() {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].toggleDrawRigidShape();
        }
    }

     /**
     * Toggles the drawing of each BoundingBox in this GameObjectSet
     * @method
     */
    toggleDrawBound() {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            let r = this.mSet[i].getRigidBody()
            if (r !== null) 
                r.toggleDrawBound();
        }
    }
}

export default GameObjectSet;