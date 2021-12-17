/*
 * File: particle_renderable.js
 *  
 * particle_renderable specifically for particles (additive blending)
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as defaultShaders from "../core/shader_resources.js";
import TextureRenderable from "./texture_renderable.js";

class ParticleRenderable extends TextureRenderable {
    constructor(myTexture) {
        super(myTexture);
        this._setShader(defaultShaders.getParticleShader());
    }
}

export default ParticleRenderable;