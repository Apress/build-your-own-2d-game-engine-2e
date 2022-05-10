/*
 * File: particle_renderable.js
 *  
 * particle_renderable specifically for particles (additive blending)
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as defaultShaders from "../core/shader_resources.js";
import TextureRenderable from "./texture_renderable.js";

class ParticleRenderable extends TextureRenderable {
    /**
     * @classdesc Renderable specifically for particles that use additive blending.
     * <p>Found in Chapter 10, page 646 of the textbook</p>
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.1.particles/index.html 10.1 Particles},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.2.particle_collisions/index.html 10.2 Particles Colliding with Rigid Shapes}
     * @constructor
     * @param {string} myTexture - the path to the image file to use as texture
     * @returns {ParticleRenderable} a new ParticleRenderable instance
     */
    constructor(myTexture) {
        super(myTexture);
        this._setShader(defaultShaders.getParticleShader());
    }
}

export default ParticleRenderable;