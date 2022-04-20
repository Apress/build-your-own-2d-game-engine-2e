/*
 * File: bounding_box.js
 *
 * defines an Axis Aligned Bounding Box (AABB)
 * 
 */
"use strict";
/**
 * Enum for collision location
 * @memberof BoundingBox
 * @enum
 */
const eBoundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
    eOutside: 0
});

class BoundingBox {
    /**
     * Default constructor for BoundingBox object
     * @constructor
     * @param {vec2} centerPos - center position of the bounding box in world coordinates
     * @param {float} w - width of the bounding box
     * @param {float} h - height of the bounding box
     * @return {BoundingBox} a new BoundingBox instance
     */
    constructor(centerPos, w, h) {
        this.mLL = vec2.fromValues(0, 0);
        this.setBounds(centerPos, w, h);
    }

    // rotation is ignored.
    // centerPos is a vec2
    /**
     * Sets the bounds of the BoundingBox ignoring rotation
     * @method
     * @param {vec2} centerPos - center position of the bounding box in world coordinates
     * @param {float} w - width of the bounding box
     * @param {float} h - height of the bounding box
     */
    setBounds(centerPos, w, h) {
        this.mWidth = w;
        this.mHeight = h;
        this.mLL[0] = centerPos[0] - (w / 2);
        this.mLL[1] = centerPos[1] - (h / 2);
    }

    /**
     * Tests if the world coordinate point (x,y) is within the BoundingBox
     * @method
     * @param {float} x  - horizontal world coordinate position
     * @param {float} y  - vertical world coordinate position
     * @returns {boolean} if the WC point (x,y) is within the BoundingBox
     */
    containsPoint(x, y) {
        return ((x > this.minX()) && (x < this.maxX()) &&
            (y > this.minY()) && (y < this.maxY()));
    }
    /**
     * Tests if this BoundingBox intersects the otherBound
     * @method
     * @param {BoundingBox} otherBound - the other BoundingBox to test for intersection
     * @returns {boolean} if this BoundingBox intersects the other
     */
    intersectsBound(otherBound) {
        return ((this.minX() < otherBound.maxX()) &&
            (this.maxX() > otherBound.minX()) &&
            (this.minY() < otherBound.maxY()) &&
            (this.maxY() > otherBound.minY()));
    }

    // returns the status of otherBound wrt to this.
    /**
     * Returns the collision status of this BoundingBox with another BoundingBox
     * @method
     * @param {BoundingBox} otherBound - the other BoundingBox to test collision with
     * @returns {eBoundCollideStatus} status - enum of collision location
     */
    boundCollideStatus(otherBound) {
        let status = eBoundCollideStatus.eOutside;

        if (this.intersectsBound(otherBound)) {
            if (otherBound.minX() < this.minX()) {
                status |= eBoundCollideStatus.eCollideLeft;
            }
            if (otherBound.maxX() > this.maxX()) {
                status |= eBoundCollideStatus.eCollideRight;
            }
            if (otherBound.minY() < this.minY()) {
                status |= eBoundCollideStatus.eCollideBottom;
            }
            if (otherBound.maxY() > this.maxY()) {
                status |= eBoundCollideStatus.eCollideTop;
            }

            // if the bounds intersects and yet none of the sides overlaps
            // otherBound is completely inside thisBound
            if (status === eBoundCollideStatus.eOutside) {
                status = eBoundCollideStatus.eInside;
            }
        }
        return status;
    }
    /**
     * Returns the x world coordinate of this BoundingBox's lower left corner
     * @method
     * @returns {float} the x world coordinate of this BoundingBox's lower left corner
     */
    minX() { return this.mLL[0]; }
    
    /**
     * Returns the x world coordinate of this BoundingBox's lower right corner
     * @method
     * @returns {float} the x world coordinate of this BoundingBox's lower right corner
     */
    maxX() { return this.mLL[0] + this.mWidth; }
   
    /**
     * Returns the y world coordinate of this BoundingBox's lower left corner
     * @method
     * @returns {float} the y world coordinate of this BoundingBox's lower left corner
     */
    minY() { return this.mLL[1]; }
   
    /**
     * Returns the y world coordinate of this BoundingBox's  upper left corner
     * @method
     * @returns {float} the y world coordinate of this BoundingBox's upper left corner
     */
    maxY() { return this.mLL[1] + this.mHeight; }
}

export {eBoundCollideStatus}
export default BoundingBox;