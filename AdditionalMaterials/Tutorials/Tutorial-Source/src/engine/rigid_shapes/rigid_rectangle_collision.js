/* File: rigid_rectangle_collision.js
 *       Adds the collision functions for RigidRectangle class
 */
"use strict";

import CollisionInfo from "./collision_info.js";
import RigidRectangle from "./rigid_rectangle_main.js";

/**
 * default constructor
 * @ignore
 * @returns {SupportStruct}
 */
class SupportStruct {
    constructor() {
        this.mSupportPoint = null;
        this.mSupportPointDist = 0;
    }
}

// temp work area to conserve run time dynamic allocation cost
let mTmpSupport = new SupportStruct();
let mCollisionInfoR1 = new CollisionInfo();
let mCollisionInfoR2 = new CollisionInfo();

/**
 * Decides on which collision function to call based on the type of shape passed
 * @memberof RigidRectangle 
 * @param {RigidShape} otherShape - The other shape to test collision
 * @param {CollisionInfo} collisionInfo - Where the collision information is stored
 * @returns {boolean} the results of the collision
 */
RigidRectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    let status = false;
    if (otherShape.mType === "RigidCircle") {
        status = this.collideRectCirc(otherShape, collisionInfo);
    } else {
        status = this.collideRectRect(this, otherShape, collisionInfo);
    }
    return status;
}

/**
 * Calculates a support point for a point on the edge of this RigidRectangle
 * @memberof RigidRectangle
 * @param {vec2} dir - the direction of the support point 
 * @param {vec2} ptOnEdge - a point on the edge of this RigidRectangle 
 */
RigidRectangle.prototype.findSupportPoint = function (dir, ptOnEdge) {
    // the longest project length
    let vToEdge = [0, 0];
    let projection;

    mTmpSupport.mSupportPointDist = -Number.MAX_VALUE;
    mTmpSupport.mSupportPoint = null;
    // check each vector of other object
    for (let i = 0; i < this.mVertex.length; i++) {
        vec2.subtract(vToEdge, this.mVertex[i], ptOnEdge);
        projection = vec2.dot(vToEdge, dir);
        
        // find the longest distance with certain edge
        // dir is -n direction, so the distance should be positive       
        if ((projection > 0) && (projection > mTmpSupport.mSupportPointDist)) {
            mTmpSupport.mSupportPoint = this.mVertex[i];
            mTmpSupport.mSupportPointDist = projection;
        }
    }
}


/**
 * Find the shortest axis of penetration between this RigidRectangle and another
 * @memberOf RigidRectangle
 * @param {RigidRectangle} otherRect - the other rectangle being tested
 * @param {CollisionInfo} collisionInfo - Record of the collision information
 * @returns {boolean} true if there is overlap in all four directions.
 */
RigidRectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {
    let n;
    let supportPoint;

    let bestDistance = Number.MAX_VALUE;
    let bestIndex = null;

    let hasSupport = true;
    let i = 0;

    let dir = [0, 0];
    while ((hasSupport) && (i < this.mFaceNormal.length)) {
        // Retrieve a face normal from A
        n = this.mFaceNormal[i];

        // use -n as direction and the vertex on edge i as point on edge    
        vec2.scale(dir, n, -1);
        let ptOnEdge = this.mVertex[i];
        // find the support on B
        // the point has longest distance with edge i 
        otherRect.findSupportPoint(dir, ptOnEdge);
        hasSupport = (mTmpSupport.mSupportPoint !== null);
        
        // get the shortest support point depth
        if ((hasSupport) && (mTmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = mTmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = mTmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    if (hasSupport) {
        // all four directions have support point
        let bestVec = [0, 0];
        vec2.scale(bestVec, this.mFaceNormal[bestIndex], bestDistance);
        let atPos = [0, 0];
        vec2.add(atPos, supportPoint, bestVec);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], atPos);
    }
    return hasSupport;
}
    
/**
 * Check for collision between a RigidRectangle and another RigidRectangle
 * @memberof RigidRectangle
 * @param {RigidRectangle} r1 - RigidRectangle object to check for collision status
 * @param {RigidRectangle} r2 - RigidRectangle object to check for collision status against
 * @param {CollisionInfo} collisionInfo - the information object for the collision
 * @returns {boolean} true if collision occurs
 */   
RigidRectangle.prototype.collideRectRect = function (r1, r2, collisionInfo) {
    let status1 = false;
    let status2 = false;

    // find Axis of Separation for both rectangle
    status1 = r1.findAxisLeastPenetration(r2, mCollisionInfoR1);

    if (status1) {
        status2 = r2.findAxisLeastPenetration(r1, mCollisionInfoR2);
        if (status2) {
            let depthVec = [0, 0];
            // if both of rectangles are overlapping, choose the shorter normal as the normal       
            if (mCollisionInfoR1.getDepth() < mCollisionInfoR2.getDepth()) {
                vec2.scale(depthVec, mCollisionInfoR1.getNormal(), mCollisionInfoR1.getDepth());
                let pos = [0, 0];
                vec2.subtract(pos, mCollisionInfoR1.mStart, depthVec);
                collisionInfo.setInfo(mCollisionInfoR1.getDepth(), mCollisionInfoR1.getNormal(), pos);
            } else {
                vec2.scale(depthVec, mCollisionInfoR2.getNormal(), -1);
                collisionInfo.setInfo(mCollisionInfoR2.getDepth(), depthVec, mCollisionInfoR2.mStart);
            }
        } 
    }
    return status1 && status2;
}

export default RigidRectangle;