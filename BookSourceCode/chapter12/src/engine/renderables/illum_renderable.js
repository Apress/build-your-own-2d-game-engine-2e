/*
 * File: illum_renderable.js
 *  
 * LightRenderable with light illumination
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as texture from "../resources/texture.js";
import * as glSys from "../core/gl.js";
import LightRenderable from "./light_renderable.js";
import Material from "../material.js";
import * as defaultShaders from "../core/shader_resources.js";


class IllumRenderable extends LightRenderable {
    /**
     * Defines a LightRenerable with a normal map for Phong illumination
     * @extends LightRenderable
     * @constructor
     * @param {string} myTexture - path to the image file to use as texture
     * @param {string} myNormalMap - path to the normal map image used for Phong illumination
     * @returns {IllumRenderable}
     */
    constructor(myTexture, myNormalMap) {
        super(myTexture);
        super._setShader(defaultShaders.getIllumShader());

        // here is the normal map resource id
        this.mNormalMap = myNormalMap;

        // Normal map texture coordinate will reproduce the corresponding sprite sheet
        // This means, the normal map MUST be based on the sprite sheet

        // Material for this Renderable
        this.mMaterial = new Material();
    }

    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    /**
     * Draw this IllumRenderable with its Material to the Camera
     * @method
     * @param {Camera} camera - the Camera to draw to
     */
    draw(camera) {
        texture.activate(this.mNormalMap, glSys.get().TEXTURE1); 
        // Here the normal map texture coordinate is copied from those of 
        // the corresponding sprite sheet
        this.mShader.setMaterialAndCameraPos(this.mMaterial, camera.getWCCenterInPixelSpace());
        super.draw(camera);
    }

    /**
     * Returns the Material used by this IllumRenderable
     * @method
     * @returns {Material} mMaterial - the Material
     */
    getMaterial() { return this.mMaterial; }
}

export default IllumRenderable;