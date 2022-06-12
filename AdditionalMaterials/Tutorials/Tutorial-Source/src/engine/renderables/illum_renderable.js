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
     * @classdesc Defines a LightRenerable with a normal map for Phong illumination
     * <p>Found in Chapter 8, page 452 of the textbook</p>
     * Examples:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter8/8.4.normal_map_and_illumination_shaders/index.html 8.4 Normal Maps and Illumination Shader},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter8/8.5.material_and_specularity/index.html 8.5 Materials and Specularity}
     
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