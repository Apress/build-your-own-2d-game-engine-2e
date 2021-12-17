/*
 * File: my_game_shadow.js 
 * 
 * Sets up shadow configuration for MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_material_control.js";

MyGame.prototype._setupShadow = function () {
    this.mBgShadow1 = new engine.ShadowReceiver(this.mBgL1);
    this.mBgShadow1.addShadowCaster(this.mIllumHero);
    this.mBgShadow1.addShadowCaster(this.mLgtHero);
    this.mBgShadow1.addShadowCaster(this.mLgtMinion);
    this.mBgShadow1.addShadowCaster(this.mIllumMinion);
}

export default MyGame;