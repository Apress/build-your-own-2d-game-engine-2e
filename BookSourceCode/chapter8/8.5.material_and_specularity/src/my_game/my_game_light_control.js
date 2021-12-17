/*
 * File: my_game_light_control.js
 * 
 * Adds interactive control for the defined lights to the MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_lights.js";

MyGame.prototype._lightControl = function () {
    let delta = 0.2;
    let msg = "";
    // player select which light to work 
    this._selectLight();

    // manipulate the light
    let lgt = this.mGlobalLightSet.getLightAt(this.mLgtIndex);
    let p = lgt.getPosition();
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
        lgt.setXPos(p[0] - delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
        lgt.setXPos(p[0] + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
        lgt.setYPos(p[1] + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
        lgt.setYPos(p[1] - delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Z)) {
        lgt.setZPos(p[2] + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.X)) {
        lgt.setZPos(p[2] - delta);
    }

    // radius
    if (engine.input.isKeyPressed(engine.input.keys.C)) {
        lgt.setNear(lgt.getNear() + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.V)) {
        lgt.setNear(lgt.getNear() - delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.B)) {
        lgt.setFar(lgt.getFar() + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.N)) {
        lgt.setFar(lgt.getFar() - delta);
    }

    // Intensity
    if (engine.input.isKeyPressed(engine.input.keys.K)) {
        lgt.setIntensity(lgt.getIntensity() + delta);
    }
    if (engine.input.isKeyPressed(engine.input.keys.L)) {
        lgt.setIntensity(lgt.getIntensity() - delta);
    }

    // on/off
    if (engine.input.isKeyClicked(engine.input.keys.H)) {
        lgt.setLightTo(!lgt.isLightOn());
    }
    msg = "On(" + lgt.isLightOn() + ") " +
          this._printVec3("P", p) +
          "R(" + lgt.getNear().toPrecision(3) + "/" + lgt.getFar().toPrecision(3) + ") " +
          "I(" + lgt.getIntensity().toPrecision(3) + ")";
    return msg;
}

MyGame.prototype._selectLight = function () {
    // select which light to work with
    if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
        this.mLgtIndex = 0;
    }
    if (engine.input.isKeyClicked(engine.input.keys.One)) {
        this.mLgtIndex = 1;
    }
    if (engine.input.isKeyClicked(engine.input.keys.Two)) {
        this.mLgtIndex = 2;
    }
    if (engine.input.isKeyClicked(engine.input.keys.Three)) {
        this.mLgtIndex = 3;
    }
}

MyGame.prototype._printVec3 = function (msg, p) {
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
}

export default MyGame;