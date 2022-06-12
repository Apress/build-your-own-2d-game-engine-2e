/* 
 * File: particle_emitter.js
 * 
 */
"use strict";

let kMinToEmit = 5; // Smallest number of particle emitted per cycle

class ParticleEmitter {
    /**
     * @classdesc Object to support generation of groups of Particles from a source
     * <p> Found in Chapter 10, page 665 of the textbook</p>
     * 
     * Example: 
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.3.particle_emitters/index.html 10.3 Particle Emitters}
     * 
     * @param {float} px - X world coordinate position for this emitter
     * @param {float} py - Y world coordinate position for this emitter
     * @param {integer} num - number of Particles to emit
     * @param {function} createrFunc - the function used to generate the Particles
     * @return {ParticleEmitter} a new ParticleEmitter instance
     */
    constructor(px, py, num, createrFunc) {
        // Emitter position
        this.mEmitPosition = [px, py];

        // Number of particles left to be emitted
        this.mNumRemains = num;

        // Function to create particles (user defined)
        this.mParticleCreator = createrFunc;
    }

    /**
     * Returns whether this ParticleEmitter has finished emitting
     * @method
     * @returns {boolean} true if all particles have been emitted
     */
    expired() { return (this.mNumRemains <= 0); }

    /**
     * Create a random number of Particles using mParticleCreator function
     * @method
     * @param {ParticleSet} pSet - ParticleSet to append the Particles created by this ParticleEmitter
     */
    emitParticles(pSet) {
        let numToEmit = 0;
        if (this.mNumRemains < this.kMinToEmit) {
            // If only a few are left, emits all of them
            numToEmit = this.mNumRemains;
        } else {
            // Otherwise, emits about 20% of what's left
            numToEmit = Math.trunc(Math.random() * 0.2 * this.mNumRemains);
        }
        // Left for future emitting.                            
        this.mNumRemains -= numToEmit;
        let i, p;
        for (i = 0; i < numToEmit; i++) {
            p = this.mParticleCreator(this.mEmitPosition[0], this.mEmitPosition[1]);
            pSet.addToSet(p);
        }
    }
}

export default ParticleEmitter;