/* 
 * File: particle_emitter.js
 * 
 */
"use strict";

let kMinToEmit = 5; // Smallest number of particle emitted per cycle

class ParticleEmitter {
    constructor(px, py, num, createrFunc) {
        // Emitter position
        this.mEmitPosition = [px, py];

        // Number of particles left to be emitted
        this.mNumRemains = num;

        // Function to create particles (user defined)
        this.mParticleCreator = createrFunc;
    }

    expired() { return (this.mNumRemains <= 0); }

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