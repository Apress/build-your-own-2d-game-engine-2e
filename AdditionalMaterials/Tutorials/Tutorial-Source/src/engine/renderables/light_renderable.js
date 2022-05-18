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
    /**
     * @classdesc Defines a SpriteAnimatedRenderable with a list of lights
     * <p>Found in Chapter 8, page 419 of the textbook</p>
     * Examples:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.2.simple_light_shader/index.html 8.2 Simple Light Shader},
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.3.multiple_lights/index.html 8.3 Multiple Lights},
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.6.directional_and_spotlights/index.html 8.6 Directional and Spot Lights}
     * @extends SpriteAnimateRenderable
     * @constructor
     * @param {string} myTexture - path to the image file to use as texture
     * @returns {LightRenderable} a new LightRenderable instance
     */
    constructor(myTexture) {
        super(myTexture);
        super._setShader(defaultShaders.getLightShader());

        // the light sources
        this.mLights = [];
    }

    /**
     * Draw this LightRenderable to the Camera
     * @method
     * @param {Camera} camera - the Camera to draw to
     */
    draw(camera) {
        this.mShader.setCameraAndLights(camera, this.mLights);
        super.draw(camera);
    }

    /**
     * Returns the number of lights this LightRenderable has
     * @method
     * @returns {integer} the length of the light list
     */
    getNumLights() {
        return this.mLights.length;
    }

    /**
     * Returns the Light at the specified index in this LightRenderable's light list
     * @method
     * @param {integer} index - the array index to access
     * @returns {Light} the Light object at the index
     */
    getLightAt(index) {
        return this.mLights[index];
    }
    /**
     * Add a Light object to this LightRenderable's list
     * @method
     * @param {Light} l - the Light object to add
     */
    addLight(l) {
        this.mLights.push(l);
    }
}

export default LightRenderable;