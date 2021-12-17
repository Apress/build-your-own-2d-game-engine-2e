"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kRefWidth = 80;
        
        this.kRefHeight = 130;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
    }

    update() { }
}

export default DyePack;