/*
 * File: shadow_receiver.js
 * Shadow support
 * 
 * Instance variables:
 *     mReceiver: Reference to any GameObject
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *     
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as shaderResources from "../core/shader_resources.js";
import ShadowCaster from "./shadow_caster.js";
import * as glSys from "../core/gl.js";

class ShadowReceiver {
    /**
     * @classdesc Support class for a GameObject having shadows cast on it.
     * Has only one target object, but supports several casters
     * <p>Found in Chapter 8, page 507 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter8/8.7.shadow_shaders/index.html 8.7 Shadow Shaders}
     * @constructor
     * @param {GameObject} theReceiverObject - the GameObject that will have shadows cast onto it
     * @returns {ShadowReceiver} a new ShadowReceiver instance
     */
    constructor(theReceiverObject) {
        this.kShadowStencilBit = 0x01;              // The stencil bit to switch on/off for shadow
        this.kShadowStencilMask = 0xFF;             // The stencil mask 
        this.mReceiverShader = shaderResources.getShadowReceiverShader();

        this.mReceiver = theReceiverObject;

        // To support shadow drawing
        this.mShadowCaster = [];                    // array of ShadowCasters
    }

    /**
     * Using argument lgtRenderable as casting object for a new ShadowCaster to add to this ShadowReceiver's list 
     * @method
     * @param {GameObject} lgtRenderable - GameObject that contains at least a LightRenderable to cast shadow
     */
    addShadowCaster(lgtRenderable) {
        let c = new ShadowCaster(lgtRenderable, this.mReceiver);
        this.mShadowCaster.push(c);
    }
    // for now, cannot remove shadow casters


    /**
     * Draw the receiver GameObject of this ShadowReceicer with the shadow cast onto it
     * @method
     * @param {Camera} aCamera - the Camera to draw to 
     */
    draw(aCamera) {
        let c;

        // Step A: draw receiver as a regular renderable
        this.mReceiver.draw(aCamera);

        // Step B: draw the receiver into the stencil buffer to enable corresponding pixels
        glSys.beginDrawToStencil(this.kShadowStencilBit, this.kShadowStencilMask);
        //        Step B1: swap receiver shader to a ShadowReceiverShader
        let s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
        //        Step B2: draw the receiver again to the stencil buffer
        this.mReceiver.draw(aCamera);
        this.mReceiver.getRenderable().swapShader(s);
        glSys.endDrawToStencil(this.kShadowStencilBit, this.kShadowStencilMask);

        // Step C: draw shadow color to the pixels in the stencil that are switched on
        for (c = 0; c < this.mShadowCaster.length; c++) {
            this.mShadowCaster[c].draw(aCamera);
        }

        // switch off stencil checking
        glSys.disableDrawToStencil();
    }

    /**
     * Update the receiving GameObject
     * @method
     */
    update() {
        this.mReceiver.update();
    }
}

export default ShadowReceiver;
