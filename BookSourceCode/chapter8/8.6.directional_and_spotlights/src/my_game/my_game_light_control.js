/*
 * File: my_game_light_control.js
 * 
 * Adds interactive control for the defined lights to the MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_lights.js";

MyGame.prototype._lightControl = function () {
    let dirDelta = 0.005;
    let delta = 0.2;
    let msg = "";
    // player select which light to work 
    this._selectLight();

    // manipulate the light
    let lgt = this.mGlobalLightSet.getLightAt(this.mLgtIndex);
    let p = lgt.getPosition();
    let d = lgt.getDirection();
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[0] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setXPos(p[0] - delta);
        }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[0] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setXPos(p[0] + delta);
        }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[1] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setYPos(p[1] + delta);
        }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[1] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setYPos(p[1] - delta);
        }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Z)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[2] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setZPos(p[2] + delta);
        }
    }
    if (engine.input.isKeyPressed(engine.input.keys.X)) {
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            d[2] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setZPos(p[2] - delta);
        }
    }

    // radius
    if (engine.input.isKeyPressed(engine.input.keys.C)) {
        lgt.setInner(lgt.getInner() + (delta * 0.01)); // convert to radian
    }
    if (engine.input.isKeyPressed(engine.input.keys.V)) {
        lgt.setInner(lgt.getInner() - (delta * 0.01)); // convert to radian
    }
    if (engine.input.isKeyPressed(engine.input.keys.B)) {
        lgt.setOuter(lgt.getOuter() + (delta * 0.01)); // convert to radian
    }
    if (engine.input.isKeyPressed(engine.input.keys.N)) {
        lgt.setOuter(lgt.getOuter() - (delta * 0.01)); // convert to radian
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

    let lMsg = "";
    if (engine.input.isKeyPressed(engine.input.keys.Space)) {
        lMsg = this._printVec3("D", d);
    } else {
        lMsg = this._printVec3("P", p);
    }
    msg = "On(" + lgt.isLightOn() + ") " + lMsg +
        "R(" + lgt.getInner().toPrecision(3) + "/" + lgt.getOuter().toPrecision(3) + ") " +
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