/* 
 * File: collision_info.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */
"use strict";

import * as debugDraw from "../core/debug_draw.js";

let kInfoColor = [1, 0, 1, 1]; // draw the info in magenta


class CollisionInfo {
    /**
     * Encapsulates collision resolution information
     * All properties are zeroed until set
     * @constructor
     * @returns {CollisionInfo} a new CollisionInfo instance
     */
    constructor() {
        this.mDepth = 0;
        this.mNormal = vec2.fromValues(0, 0);
        this.mStart = vec2.fromValues(0, 0);
        this.mEnd = vec2.fromValues(0, 0);
    }

    /**
     * Returns the interpenetration depth between the colliding shapes
     * @method
     * @returns {float} mDepth - interpenetration depth
     */
    getDepth() { return this.mDepth; }
    /**
     * Sets the interpenetration depth between the colliding shapes
     * @method
     * @param {float} s - the new interpenetration depth  
     */
    setDepth(s) { this.mDepth = s; }

    /**
     * Returns the normal vector for this CollisionInfo
     * @method
     * @returns {vec2} mNormal - the normal vector
     */
    getNormal() { return this.mNormal; }

    /**
     * Sets the normal vector for this CollisionInfo
     * @method
     * @param {vec2} s - the new normal vector 
     */
    setNormal(s) { this.mNormal = s; } 

    /**
     * Returns the starting [X,Y] position for this CollisionInfo
     * @method
     * @returns {vec2} mStart - starting position
     */
    getStart() { return this.mStart; }
    
    /**
     * Returns the ending [X,Y] position for this CollisionInfo
     * @method
     * @returns {vec2} mEnd - ending position
     */
    getEnd() { return this.mEnd; }

    /**
     * Sets all the properties that describe this CollisionInfo.
     * Calculates ending position based on starting position, normal vector, and depth
     * @method
     * @param {float} d - the depth of interpenetration between the shapes
     * @param {vec2} n - the normal vector for the collision
     * @param {vec2} s - the [X,Y] starting position in world coordinates
     */
    setInfo(d, n, s) {
        this.mDepth = d;
        this.mNormal[0] = n[0];
        this.mNormal[1] = n[1];
        this.mStart[0] = s[0];
        this.mStart[1] = s[1];
        vec2.scaleAndAdd(this.mEnd, s, n, d);
    }
    /**
     * Reverses the direction of the interpenetration resolution this CollisionInfo encapsulates
     * @method
     */
    changeDir() {
        vec2.scale(this.mNormal, this.mNormal, -1);
        let n = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = n;
    }
    /**
     * Draw a line on aCamera that shows this CollisionInfo
     * @param {Camera} aCamera - the Camera to draw to
     */
    draw(aCamera) {
        debugDraw.drawLine(aCamera, this.mStart, this.mEnd, true, kInfoColor);
    }
}

export default CollisionInfo;