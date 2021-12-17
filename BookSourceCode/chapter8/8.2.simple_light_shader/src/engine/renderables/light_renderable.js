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

        // here is the light source
        this.mLight = null;
    }

    draw(camera) {
        this.mShader.setCameraAndLight(camera, this.mLight);
        super.draw(camera);
    }

    getLight() {
        return this.mLight;
    }
    addLight(l) {
        this.mLight = l;
    }
}

export default LightRenderable;