/* File: light_set.js 
 *
 * Support for working with a set of Lights
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

class LightSet{
    constructor() {
        this.mSet = [];
    }

    numLights() { return this.mSet.length; }

    getLightAt(index) {
        return this.mSet[index];
    }

    addToSet(light) {
        this.mSet.push(light);
    }
}

export default LightSet