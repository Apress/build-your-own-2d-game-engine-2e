/*
 * File: my_game_lights.js 
 * Adds light creation methods to the MyGame class
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_main.js";

MyGame.prototype._createALight = function (type, pos, dir, color, n, f, inner, outer, intensity, dropOff) {
    let light = new engine.Light();
    light.setLightType(type);
    light.setColor(color);
    light.setXPos(pos[0]);
    light.setYPos(pos[1]);
    light.setZPos(pos[2]);
    light.setDirection(dir);
    light.setNear(n);
    light.setFar(f);
    light.setInner(inner);
    light.setOuter(outer);
    light.setIntensity(intensity);
    light.setDropOff(dropOff);

    return light;
}

MyGame.prototype._initializeLights = function () {
    this.mGlobalLightSet = new engine.LightSet();

    let l = this._createALight(engine.eLightType.ePointLight,
        [15, 50, 5],         // position
        [0, 0, -1],          // Direction 
        [0.6, 1.0, 0.0, 1],  // some color
        8, 20,               // near and far distances
        0.1, 0.2,            // inner and outer cones
        5,                   // intensity
        1.0                  // drop off
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(engine.eLightType.eDirectionalLight,
        [15, 50, 4],           // position (not used by directional)
        [-0.2, -0.2, -1],      // Pointing direction upwards
        [0.7, 0.7, 0.0, 1],     // color
        500, 500,               // near anf far distances: essentially switch this off
        0.1, 0.2,               // inner and outer cones
        2,                      // intensity
        1.0                     // drop off
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(engine.eLightType.eSpotLight,
        [80, 18, 10],            // Right minion position
        [-0.07, 0, -1],         // direction
        [0.5, 0.5, 0.5, 1],     // color
        100, 100,               // near and far distances
        1.65, 1.7,              // inner outer angles (in radius)
        5,                      // intensity
        1.2                     // drop off
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(engine.eLightType.eSpotLight,
        [64, 43, 10],            // Center of camera 
        [0.0, 0.03, -1],         // direction
        [0.8, 0.8, 0.2, 1],      //  color
        100, 100,                // near and far distances
        1.9, 2.0,                // inner and outer cones
        2,                       // intensity
        1                        // drop off
    );
    this.mGlobalLightSet.addToSet(l);
}

export default MyGame;