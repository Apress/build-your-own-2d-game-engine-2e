/*
 * File: transform.js 
 *
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */
"use strict";

class Transform {
    /**
     * @classdesc Encapsulates the matrix transformation functionality, meant to work with Renderables
     * <p>Found in Chapter 3, page 84 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter3/3.3.transform_objects/index.html 3.3 Transform Objects}
     * @constructor
     * @returns {Transform} a new Transform instance
     */
    constructor() {
        this.mPosition = vec2.fromValues(0, 0);  // this is the translation
        this.mScale = vec2.fromValues(1, 1);     // this is the width (x) and height (y)
        this.mZ = 0.0;                           // must be a positive number, a larger value is closer to the eye
        this.mRotationInRad = 0.0;               // in radians!
    }

    /**
     * Clones the attributes of this Transforms to the Transform Arugment
     * @method
     * @param {Transform} aXform - the Transform object to be cloned into
     */
    cloneTo(aXform) {
        aXform.mPosition = vec2.clone(this.mPosition);
        aXform.mScale = vec2.clone(this.mScale);
        aXform.mZ = this.mZ;
        aXform.mRotationInRad = this.mRotationInRad;
    }
    /**
     * Sets the x and y position of this Transform in world coordinates
     * @method
     * @param {float} xPos - the x position of the Transform
     * @param {float} yPos - the y position of the Transform
     */
    setPosition(xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); }

    /**
     * Returns the world coordinate position of this Transform
     * @method
     * @returns {vec2} mPosition - the x and y position of this Transform
     */
    getPosition() { return this.mPosition; }

    /**
     * Returns the three dimensional world coordinate position of this Transform
     * @method
     * @returns {vec3} the x,y,z position of this Transform
     */
    get3DPosition() { return vec3.fromValues(this.getXPos(), this.getYPos(), this.getZPos()); }

    /**
     * Returns the x world coordinate position of this Transform
     * @method
     * @returns {float} mPosition[0] - the x world coordinate position of this Transform
     */
    getXPos() { return this.mPosition[0]; }

    /**
     * Sets the x world Coordinate of this Tranform
     * @method
     * @param {float} xPos - the x position to set for this Transform 
     */
    setXPos(xPos) { this.mPosition[0] = xPos; }

    /**
     * Add a value to the x world coordinate of this Transform
     * @method
     * @param {float} delta - the value to be added to the current x value 
     */
    incXPosBy(delta) { this.mPosition[0] += delta; }
    /**
     * Returns the y world coordinate position of this Transform
     * @method
     * @returns {float} mPosition[0] - the y world coordinate position of this Transform
     */
    getYPos() { return this.mPosition[1]; }
    /**
     * Sets the y world Coordinate of this Tranform
     * @method
     * @param {float} yPos - the y position to set for this Transform 
     */
    setYPos(yPos) { this.mPosition[1] = yPos; }
    /**
     * Add a value to the y world coordinate of this Transform
     * @method
     * @param {float} delta - the value to be added to the current y value 
     */
    incYPosBy(delta) { this.mPosition[1] += delta; }

    /** 
     * Sets the z world Coordinate of this Tranform
     * @method
     * @param {float} d - the z position to set for this Transform 
     */
    setZPos(d) { this.mZ = d; }

    /**
     * Returns the z world coordinate position of this Transform
     * @method
     * @returns {float} mZ - the z world coordinate position of this Transform
     */
    getZPos() { return this.mZ; }
    /**
     * Add a value to the z world coordinate of this Transform
     * @method
     * @param {float} delta - the value to be added to the current z value 
     */
    incZPosBy(delta) { this.mZ += delta; }

    /**
     * Sets the size of this Transform
     * @param {float} width - the new width of this Transform
     * @param {float} height - the new height of this Transform
     */
    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }

    /**
     * Returns the width and height of this Transform
     * @method
     * @returns {vec2} mScale - the width and height of this Transform
     */
    getSize() { return this.mScale; }

    /**
     * Adds a value to the width and height of this Transform
     * @method
     * @param {float} delta - the value to be added to both the width and height
     */
    incSizeBy(delta) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    }

    /**
     * Returns the width of this Transform
     * @method
     * @returns {float} mScale[0] - the width of this Transform
     */
    getWidth() { return this.mScale[0]; }

    /**
     * Set the width of this Transform
     * @param {float} width - new width
     */
    setWidth(width) { this.mScale[0] = width; }

    /**
     * Adds a delta to the width
     * @param {float} delta - the value to add
     */
    incWidthBy(delta) { this.mScale[0] += delta; }

    /**
     * Returns the height of this Transform
     * @method
     * @returns {float} mScale[1] - the height of this Transform
     */
    getHeight() { return this.mScale[1]; }

    /**
     * Sets the new height of this Transform
     * @method
     * @param {float} height  - the new height to set for this Transform
     */
    setHeight(height) { this.mScale[1] = height; }

    /**
     * Add a value to the height of this Transform
     * @method
     * @param {float} delta - the value to be added to the height
     */
    incHeightBy(delta) { this.mScale[1] += delta; }

    /**
     * Sets the new rotation in radians of this Transform, internally bounded to [0,2*PI]
     * @method
     * @param {float} rotationInRadians - the new rotation value for this Transform
     */
    setRotationInRad(rotationInRadians) {
        this.mRotationInRad = rotationInRadians;
        while (this.mRotationInRad > (2 * Math.PI)) {
            this.mRotationInRad -= (2 * Math.PI);
        }
    }
     /**
     * Sets the new rotation in degrees of this Transform, internally bounded to [0,360]
     * @method
     * @param {float} rotationInDegree - the new rotation value for this Transform
     */
    setRotationInDegree(rotationInDegree) {
        this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
    }

    /**
     * Adds deltaDegree to the current rotation value of this Transform
     * @method
     * @param {float} deltaDegree - value to be added to the rotation, in degrees
     */
    incRotationByDegree(deltaDegree) {
        this.incRotationByRad(deltaDegree * Math.PI / 180.0);
    }

    /**
     * Adds deltaRad to the current rotation value of this Transform
     * @method
     * @param {float} deltaRad - value to be added to the rotation, in radians
     */
    incRotationByRad(deltaRad) {
        this.setRotationInRad(this.mRotationInRad + deltaRad);
    }

    /**
     * Returns the rotation of this Transform in radians
     * @method
     * @returns {float} mRotationInRad - the rotation of this Transform in radians
     */
    getRotationInRad() {  return this.mRotationInRad; }

    /**
     * Returns the width of this Transform in degrees
     * @method
     * @returns {float} the rotation of this Transform in degrees
     */
    getRotationInDegree() { return this.mRotationInRad * 180.0 / Math.PI; }
    
    // returns the matrix the concatenates the transformations defined
    /**
     * Returns the matrix of this Transform used to control Renderables
     * @method
     * @returns {mat4} matrix - the translated, rotated, and scaled matrix
     */
    getTRSMatrix() {
        // Creates a blank identity matrix
        let matrix = mat4.create();

        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.

        // Step A: compute translation, for now z is the height
        mat4.translate(matrix, matrix, this.get3DPosition());
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

        return matrix;
    }
}

export default Transform;