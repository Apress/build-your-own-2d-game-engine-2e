/*
 * File: light_renderable.js
 *  
 * SpriteAnimatedRenderable with light illumination
 */
"use strict";

import SpriteAnimateRenderable from "./sprite_animate_renderable.js";
import * as defaultShaders from "../core/shader_resources.js";

// Operate in Strict mode such that variables must be declared before used!

class LightRenderable extends SpriteAnimateRenderable {

    constructor(myTexture) {
        super(myTexture);
        super._setShader(defaultShaders.getLightShader());

        // the light sources
        this.mLights = [];
    }

    draw(camera) {
        this.mShader.setCameraAndLights(camera, this.mLights);
        super.draw(camera);
    }

    getLightAt(index) {
        return this.mLights[index];
    }
    addLight(l) {
        this.mLights.push(l);
    }
}

export default LightRenderable;