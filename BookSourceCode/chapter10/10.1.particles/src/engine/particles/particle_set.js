/* 
 * File: particle_set.js
 * a set of Particles
 * 
 * Subclass of GameObjectSet: 
 *     GameObjectSet: a set of objects that support: update() and draw() functions
 *                     Particle satisfies!
 */
"use strict";

import * as glSys from "../core/gl.js";
import GameObjectSet from "../game_objects/game_object_set.js";

class ParticleSet extends GameObjectSet {
    constructor() {
        super();
    }

    draw(aCamera) {
        let gl = glSys.get();
        gl.blendFunc(gl.ONE, gl.ONE);  // for additive blending!
        super.draw(aCamera);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
    }

    drawMarkers(aCamera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].drawMarker(aCamera);
        }
    }

    update() {
        super.update();
        // Cleanup Particles
        let i, obj;
        for (i = 0; i < this.size(); i++) {
            obj = this.getObjectAt(i);
            if (obj.hasExpired()) {
                this.removeFromSet(obj);
            }
        }
    }
}

export default ParticleSet;