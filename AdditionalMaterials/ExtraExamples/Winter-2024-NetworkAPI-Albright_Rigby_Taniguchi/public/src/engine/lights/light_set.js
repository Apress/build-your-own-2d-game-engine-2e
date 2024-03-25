/* File: light_set.js 
 *
 * Support for working with a set of Lights
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

class LightSet{
    /**
     * @classdesc List structure to facilitate working with multiple Lights
     * <p>Found in Chapter 9, page 434 of the textbook</p>
     * Example: 
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter8/8.3.multiple_lights/index.html 8.3 Multiple Lights}
     * @constructor
     * @returns {LightSet} a new LightSet instance
     */
    constructor() {
        this.mSet = [];
    }
    /**
     * Returns the length of this LightSet
     * @method
     * @returns {integer} length of the set
     */
    numLights() { return this.mSet.length; }

    /**
     * Return the Light at the specified index of this LightSet
     * @method
     * @param {integer} index - the index in the set to grab 
     * @returns {Light} the Light at that index
     */
    getLightAt(index) {
        return this.mSet[index];
    }

    /**
     * Adds a Light object to the end of this LightSet
     * @method
     * @param {Light} light - the Light to add 
     */
    addToSet(light) {
        this.mSet.push(light);
    }
}

export default LightSet