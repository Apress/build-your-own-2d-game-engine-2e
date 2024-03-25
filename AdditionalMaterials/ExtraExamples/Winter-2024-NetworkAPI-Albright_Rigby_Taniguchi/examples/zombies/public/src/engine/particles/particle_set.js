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
import ParticleEmitter from "./particle_emitter.js";

class ParticleSet extends GameObjectSet {

    /**
     * @classdesc Support a list of Particles and ParticleEmitters
     * <p> Found in Chapter 10, page 652 of the textbook</p>
     * 
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.1.particles/index.html 10.1 Particles}
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.2.particle_collisions/index.html 10.2 Particle Collision}
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.3.particle_emitters/index.html 10.3 Particle Emitters}
     * 
     * @extends GameObjectSet
     * @returns {ParticleSet} a new ParticleSet instance
     */
    constructor() {
        super();
        this.mEmitterSet = [];
    }

    /**
     * Draw the Particles in this ParticleSet using additive blending
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    draw(aCamera) {
        let gl = glSys.get();
        gl.blendFunc(gl.ONE, gl.ONE);  // for additive blending!
        super.draw(aCamera);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
    }

    /**
     * Add a new ParticleEmitter to the lsit
     * @method
     * @param {float} x - X world coordinate position for this Emitter
     * @param {float} y - Y world coordinate position for this Emitter
     * @param {int} n - number of Particles to emit
     * @param {function} func - function for the emitter to use for Particle Generation
     */
    addEmitterAt(x, y, n, func) {
        let e = new ParticleEmitter(x, y, n, func);
        this.mEmitterSet.push(e);
    }

    /**
     * Draw the markers of the Particles in this ParticleSet
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    drawMarkers(aCamera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].drawMarker(aCamera);
        }
    }

    /**
     * Emit Particles and prune expired objects
     * @method
     */
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

        // Emit new particles
        for (i = 0; i < this.mEmitterSet.length; i++) {
            let e = this.mEmitterSet[i];
            e.emitParticles(this);
            if (e.expired()) {  // delete the emitter when done
                this.mEmitterSet.splice(i, 1);
            }
        }
    }
}

export default ParticleSet;