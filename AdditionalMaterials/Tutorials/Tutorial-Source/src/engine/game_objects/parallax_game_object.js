/* File: parallex_game_object.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * Passed in scale: 
 *     ==1: means same as actors
 *     > 1: farther away, slows down inversely (scale==2 slows down twice)
 *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import TiledGameObject from "./tiled_game_object.js";


class ParallaxGameObject extends TiledGameObject {
    /**
     * @classdesc Represent an GameObject located at some distance D away, thus 
     * resulting in slower movements
     * <p>Found in Chapter 11, page 681 of the textbook</p>
     * Example: 
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter11/11.2.parallax_objects/index.html 11.2 Parallax Objects}
     * 
     * @constructor
     * @extends TiledGameObject
     * @param {Renderable} renderableObj - the Renderable associated with this ParallaxGameObject
     * @param {float} scale - determines how far forward or back this ParallaxGameObject is
     *     ==1: means same as actors
     *     > 1: farther away, slows down inversely (scale==2 slows down twice)
     *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
     * @param {Camera} aCamera - the Camera this ParallaxGameOjbect will be drawn to
     */
    constructor(renderableObj, scale, aCamera) {
        super(renderableObj);
        this.mRefCamera = aCamera;
        this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
        this.mParallaxScale = 1;
        this.setParallaxScale(scale);
    }

    //
    // renderableObj xfrom is accessible, it is in WC space!!
    // GameObject parameters: speed and direction are all in WC space
    //
    /**
     * Update this ParallaxGameObject, moving  it if the Camera has moved
     * @method
     */
    update() {
        // simple default behavior
        this._refPosUpdate(); // check to see if the camera has moved
        super.update();
    }
    
    _refPosUpdate() {
        // now check for reference movement
        let deltaT = vec2.fromValues(0, 0);
        vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
        this.setWCTranslationBy(deltaT);
        vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT); // update WC center ref position
    }
    /**
     * Set world coordinate translation delta to change the position of this ParallaxGameObject
     * @method
     * @param {vec2} delta - [x,y] world coordinate values to translate 
     */
    setWCTranslationBy(delta) {
        let f = (1 - (1/this.mParallaxScale));
        this.getXform().incXPosBy(-delta[0] * f);
        this.getXform().incYPosBy(-delta[1] * f);
    }

    /**
     * Returns the current distance scale for this ParallaxGameObject
     * @method
     * @returns {float} mParallaxScale - the distance scale
     */
    getParallaxScale() {
        return this.mParallaxScale;
    }

    /**
     * Set the distance scale for this ParallaxGameObject
     * @method
     * @param {float} s - the new distance scale
     *     ==1: means same as actors
     *     > 1: farther away, slows down inversely (scale==2 slows down twice)
     *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
     */
    setParallaxScale(s) {
        this.mParallaxScale = s;
        if (s <= 0) {
            this.mParallaxScale = 1;
        }
    }
}

export default ParallaxGameObject;