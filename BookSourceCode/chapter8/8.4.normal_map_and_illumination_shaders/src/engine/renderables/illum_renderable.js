/*
 * File: illum_renderable.js
 *  
 * LightRenderable with light illumination
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as texture from "../resources/texture.js";
import * as glSys from "../core/gl.js";
import LightRenderable from "./light_renderable.js";
import * as defaultShaders from "../core/shader_resources.js";


class IllumRenderable extends LightRenderable {
    constructor(myTexture, myNormalMap) {
        super(myTexture);
        super._setShader(defaultShaders.getIllumShader());

        // here is the normal map resource id
        this.mNormalMap = myNormalMap;

        // Normal map texture coordinate will reproduce the corresponding sprite sheet
        // This means, the normal map MUST be based on the sprite sheet
    }

    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    draw(camera) {
        texture.activate(this.mNormalMap, glSys.get().TEXTURE1); 
        // Here the normal map texture coordinate is copied from those of 
        // the corresponding sprite sheet
        super.draw(camera);
    }
}

export default IllumRenderable;