/*
 * File: texture_renderable.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import Renderable from "./renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";

class TextureRenderable extends Renderable {
    constructor(myTexture, secondTexture = null) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getTextureShader());
        this.mTexture = myTexture;  // texture for this object, cannot be a "null"
        this.mSecondTexture = secondTexture;
        this.mSecondTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0];  // u, v, w, h, theta
    }

    draw(camera) {
        let en = false;  // for second texture;
        // activate the texture
        texture.activate(this.mTexture, glSys.get().TEXTURE0);
        if (this.mSecondTexture != null) {
            texture.activate(this.mSecondTexture, glSys.get().TEXTURE1);
            this.mShader.placeAtWithSize(this.mSecondTexturePlacement, 
                this.getXform().getWidth()/this.getXform().getHeight());
            en = true;
        }       
        this.mShader.enableSecondTexture(en);
        
        super.draw(camera);
    }

    setSecondTexture(u, v, w, h, t) {
        this.mSecondTexturePlacement[0] = u;
        this.mSecondTexturePlacement[1] = v;
        this.mSecondTexturePlacement[2] = w;
        this.mSecondTexturePlacement[3] = h;
        this.mSecondTexturePlacement[4] = t;
    }

    getTexture() { return this.mTexture; }
    setTexture(newTexture) {
        this.mTexture = newTexture;
    }
}

export default TextureRenderable;