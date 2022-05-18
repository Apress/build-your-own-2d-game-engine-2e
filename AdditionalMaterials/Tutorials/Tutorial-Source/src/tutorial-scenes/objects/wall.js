/* File: wall.js 
 *
 * Creates and initializes a Platform
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
import engine from "../../engine/index.js";

const kWallWidth = 1.2;
const kWallHeight = 5;

class Wall extends engine.GameObject {
    constructor(cx, cy, texture, normal, lightSet) {
        super(null);

        this.mRenderComponent = new engine.IllumRenderable(texture, normal);
        let i;
        for (i = 0; i < lightSet.numLights(); i++) {
            this.mRenderComponent.addLight(lightSet.getLightAt(i));
        }
        this.getXform().setSize(kWallWidth, kWallHeight);
        this.getXform().setPosition(cx, cy);

        let rigidShape = new engine.RigidRectangle(this.getXform(), kWallWidth, kWallHeight);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.toggleDrawBound();
        this.setRigidBody(rigidShape);
    }
}

export default Wall;