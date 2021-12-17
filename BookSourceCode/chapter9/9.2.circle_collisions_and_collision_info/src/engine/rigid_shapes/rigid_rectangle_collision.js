/* File: rigid_rectangle_collision.js
 *       Adds the collision functions for RigidRectangle class
 */
"use strict";

import CollisionInfo from "./collision_info.js";
import RigidRectangle from "./rigid_rectangle_main.js";

/**
 * Decides on which collision function to call based on the type of shape passed
 * @memberOf RigidRectangle 
 * @param {RigidShape} otherShape The other shape that's involved
 * @param {CollisionInfo} collisionInfo Where the collision information is stored
 * @returns {Boolean} The results of the collision
 */
RigidRectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    let status = false;
    if (otherShape.mType === "RigidCircle") {
        status = false;
    } else {
        status = false;
    }
    return status;
}

export default RigidRectangle;