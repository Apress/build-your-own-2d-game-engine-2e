/* 
 * File: collision_info.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */
"use strict";

import * as debugDraw from "../core/debug_draw.js";

let kInfoColor = [1, 0, 1, 1]; // draw the info in magenta

class CollisionInfo {
    constructor() {
        this.mDepth = 0;
        this.mNormal = vec2.fromValues(0, 0);
        this.mStart = vec2.fromValues(0, 0);
        this.mEnd = vec2.fromValues(0, 0);
    }

    getDepth() { return this.mDepth; }
    setDepth(s) { this.mDepth = s; }

    getNormal() { return this.mNormal; }
    setNormal(s) { this.mNormal = s; } 

    getStart() { return this.mStart; }
    getEnd() { return this.mEnd; }

    setInfo(d, n, s) {
        this.mDepth = d;
        this.mNormal[0] = n[0];
        this.mNormal[1] = n[1];
        this.mStart[0] = s[0];
        this.mStart[1] = s[1];
        vec2.scaleAndAdd(this.mEnd, s, n, d);
    }

    changeDir() {
        vec2.scale(this.mNormal, this.mNormal, -1);
        let n = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = n;
    }

    draw(aCamera) {
        debugDraw.drawLine(aCamera, this.mStart, this.mEnd, true, kInfoColor);
    }
}

export default CollisionInfo;