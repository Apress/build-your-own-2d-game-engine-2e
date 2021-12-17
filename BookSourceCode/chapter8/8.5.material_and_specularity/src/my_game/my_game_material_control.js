/*
 * File: my_game_material_control.js
 * 
 * Adds interactive control for Material to the MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_light_control.js";

MyGame.prototype._materialControl = function () {
    let delta = 0.01;
    let msg = "";

    // player select which object and material channel to work 
    this._selectMaterialChannel();

    // manipulate the selected component Ambient, Diffuse, Specular
    if (engine.input.isKeyPressed(engine.input.keys.E)) {
        this.mMaterialCh[0] += delta;
    }
    if (engine.input.isKeyPressed(engine.input.keys.R)) {
        this.mMaterialCh[0] -= delta;
    }
    if (engine.input.isKeyPressed(engine.input.keys.T)) {
        this.mMaterialCh[1] += delta;
    }
    if (engine.input.isKeyPressed(engine.input.keys.Y)) {
        this.mMaterialCh[1] -= delta;
    }
    if (engine.input.isKeyPressed(engine.input.keys.U)) {
        this.mMaterialCh[2] += delta;
    }
    if (engine.input.isKeyPressed(engine.input.keys.I)) {
        this.mMaterialCh[2] -= delta;
    }

    // shinningess
    let mat = this.mSlectedCh.getRenderable().getMaterial();
    if (engine.input.isKeyPressed(engine.input.keys.O)) {
        mat.setShininess(mat.getShininess() + 10*delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.P)) {
        mat.setShininess(mat.getShininess() - 10*delta);
    }

    msg += "n(" + mat.getShininess().toPrecision(2) + ")" +
        this._printVec3("D", mat.getDiffuse()) +
        this._printVec3("S", mat.getSpecular()) +
        this._printVec3("A", mat.getAmbient());

    return msg;
}

MyGame.prototype._selectMaterialChannel = function () {
    // select which character to work with
    if (engine.input.isKeyClicked(engine.input.keys.Seven)) {
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getAmbient();
    }
    if (engine.input.isKeyClicked(engine.input.keys.Eight)) {
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
    }
    if (engine.input.isKeyClicked(engine.input.keys.Nine)) {
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getSpecular();
    }
}


export default MyGame;