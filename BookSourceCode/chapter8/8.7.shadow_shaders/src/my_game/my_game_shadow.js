/*
 * File: my_game_shadow.js 
 * 
 * Sets up shadow configuration for MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_material_control.js";

MyGame.prototype._setupShadow = function () {
        // mLgtMinion has a LightRenderable
    this.mLgtMinionShadow = new engine.ShadowReceiver(this.mLgtMinion);
    this.mLgtMinionShadow.addShadowCaster(this.mIllumHero);
    this.mLgtMinionShadow.addShadowCaster(this.mLgtHero);

        // mIllumMinion has a SpriteAnimateRenderable
    this.mMinionShadow = new engine.ShadowReceiver(this.mIllumMinion);
    this.mMinionShadow.addShadowCaster(this.mIllumHero);
    this.mMinionShadow.addShadowCaster(this.mLgtHero);
    this.mMinionShadow.addShadowCaster(this.mLgtMinion);

        // mBg has a IllumRenderable
    this.mBgShadow = new engine.ShadowReceiver(this.mBg);
    this.mBgShadow.addShadowCaster(this.mLgtHero);
    this.mBgShadow.addShadowCaster(this.mIllumMinion);
    this.mBgShadow.addShadowCaster(this.mLgtMinion);
}

export default MyGame;