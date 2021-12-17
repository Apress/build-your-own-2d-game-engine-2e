/* File: wasd_obj.js
 *
 * Defines the keyControl function
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
let kWASDDelta = 0.3;

import engine from "../../engine/index.js";

class WASDObj extends engine.GameObject {
    constructor() {
        super();
    }

    keyControl() {
        let xform = this.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.incYPosBy(kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.incYPosBy(-kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incXPosBy(-kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incXPosBy(kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            xform.incRotationByDegree(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            xform.incRotationByDegree(-1);
        }
        this.getRigidBody().userSetsState();
    }
}
export default WASDObj;