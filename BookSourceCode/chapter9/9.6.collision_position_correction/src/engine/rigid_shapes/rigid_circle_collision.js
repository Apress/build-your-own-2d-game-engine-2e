/* File: rigid_circle_collision.js
 *       Adds the collision functions for RigidCircle class
 */
"use strict";

import RigidCircle from "./rigid_circle_main.js";

RigidCircle.prototype.collisionTest = function (otherShape, collisionInfo) {
    let status = false;
    if (otherShape.mType === "RigidCircle") {
        status = this.collideCircCirc(this, otherShape, collisionInfo);
    } else {
        status = otherShape.collideRectCirc(this, collisionInfo);
    }
    return status;
}

RigidCircle.prototype.collideCircCirc = function (c1, c2, collisionInfo) {
    let vFrom1to2 = [0, 0];
    // Step 1: Determine if the circles overlap
    vec2.subtract(vFrom1to2, c2.getCenter(), c1.getCenter());
    let rSum = c1.mRadius + c2.mRadius;
    let dist = vec2.length(vFrom1to2);
    if (dist > Math.sqrt(rSum * rSum)) {
        // not overlapping
        return false;
    }
    if (dist !== 0) {
        // Step 2: Colliding circle centers are at different positions
        vec2.normalize(vFrom1to2, vFrom1to2);
        let vToC2 = [0, 0];
        vec2.scale(vToC2, vFrom1to2, -c2.mRadius);
        vec2.add(vToC2, c2.getCenter(), vToC2);
        collisionInfo.setInfo(rSum - dist, vFrom1to2, vToC2);
    } else {
        let n = [0, -1];
        // Step 3: Colliding circle centers are at exactly the same position
        if (c1.mRadius > c2.mRadius) {
            let pC1 = c1.getCenter();
            let ptOnC1 = [pC1[0], pC1[1] + c1.mRadius];
            collisionInfo.setInfo(rSum, n, ptOnC1);
        } else {
            let pC2 = c2.getCenter();
            let ptOnC2 = [pC2[0], pC2[1]+ c2.mRadius];
            collisionInfo.setInfo(rSum, n, ptOnC2);
        }
    }
    return true;
}

export default RigidCircle;