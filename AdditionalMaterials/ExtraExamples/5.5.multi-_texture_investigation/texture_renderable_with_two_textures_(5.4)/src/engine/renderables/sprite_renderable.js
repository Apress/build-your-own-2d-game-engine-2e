/*
 * File: sprite_renderable.js
 *
 * Supports the drawing and of one sprite element mapped onto entire Renderable
 * 
 */
"use strict";

import TextureRenderable from "./texture_renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";
  
// the expected texture coordinate array is an array of 8 floats where elements:
//  [0] [1]: is u/v coordinate of Top-Right 
//  [2] [3]: is u/v coordinate of Top-Left
//  [4] [5]: is u/v coordinate of Bottom-Right
//  [6] [7]: is u/v coordinate of Bottom-Left
// Convention: eName is an enumerated data type
const eTexCoordArrayIndex = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});
    
class SpriteRenderable extends TextureRenderable {
    constructor(myTexture) {
        super(myTexture);
        super._setShader(shaderResources.getSpriteShader());
        // sprite coordinate
        this.mElmLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
        this.mElmRight = 1.0;  // 
        this.mElmTop = 1.0;    //   1 is top and 0 is bottom of image
        this.mElmBottom = 0.0; // 
    }

    // specify element region by texture coordinate (between 0 to 1)
    setElementUVCoordinate(left, right, bottom, top) {
        this.mElmLeft = left;
        this.mElmRight = right;
        this.mElmBottom = bottom;
        this.mElmTop = top;
    }

    // specify element region by pixel positions (between 0 to image resolutions)
    setElementPixelPositions(left, right, bottom, top) {
        let texInfo = texture.get(this.mTexture);
        // entire image width, height
        let imageW = texInfo.mWidth;
        let imageH = texInfo.mHeight;

        this.mElmLeft = left / imageW;
        this.mElmRight = right / imageW;
        this.mElmBottom = bottom / imageH;
        this.mElmTop = top / imageH;
    }

    getElementUVCoordinateArray() {
        return [
            this.mElmRight,  this.mElmTop,          // x,y of top-right
            this.mElmLeft,   this.mElmTop,
            this.mElmRight,  this.mElmBottom,
            this.mElmLeft,   this.mElmBottom
        ];
    }

    draw(camera) {
        // set the current texture coordinate
        // 
        // activate the texture
        this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
        super.draw(camera);
    }
}

export default SpriteRenderable;
export {eTexCoordArrayIndex}