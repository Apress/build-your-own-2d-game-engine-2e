/* File: tiled_game_objects.js 
 *
 * Infinitely tiled, assume X/Y alignments
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "./game_object.js";

class TiledGameObject extends GameObject {
    /**
     * @classdesc Support for repeating renderable tiles, infinitely tileable.
     * Assumes X/Y alignments.
     * <p>Found in Chapter 11, page 674 of the textbook  </p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter11/11.1.tiled_objects/index.html 11.1 Tiled Objects}
     * @constructor
     * @extends GameObject
     * @param {Renderable} renderableObj - the Renderable associated with this TiledGameObject
     * @returns {TiledGameObject} a new TileGameObject instance
     */
    constructor(renderableObj) {
        super(renderableObj);

        this.mShouldTile = true; // can switch this off if desired
    }

    /**
     * Set the tiling property to true or false
     * @method
     * @param {boolean} t - the tiling state
     */
    setIsTiled(t) {
        this.mShouldTile = t;
    }
    /**
     * Returns whether or not tiling is active for this TiledGameObject
     * @method
     * @returns {boolean} mShouldTile - true if tiling is active
     */
    shouldTile() {
        return this.mShouldTile;
    }

    /**
     * Draws a grid of tiles filling every available space within the Camera
     * @method
     * @param {Camera} aCamera - the Camera to draw to 
     */
    _drawTile(aCamera) {
        // Step A: Compute the positions and dimensions of tiling object.
        let xf = this.getXform();
        let w = xf.getWidth();
        let h = xf.getHeight();
        let pos = xf.getPosition();
        let left = pos[0] - (w / 2);
        let right = left + w;
        let top = pos[1] + (h / 2);
        let bottom = top - h;

        // Step B: Get the world positions and dimensions of the drawing camera.
        let wcPos = aCamera.getWCCenter();
        let wcLeft = wcPos[0] - (aCamera.getWCWidth() / 2);
        let wcRight = wcLeft + aCamera.getWCWidth();
        let wcBottom = wcPos[1] - (aCamera.getWCHeight() / 2);
        let wcTop = wcBottom + aCamera.getWCHeight();

        // Step C: Determine the offset to the camera window's lower left corner.
        let dx = 0, dy = 0; // offset to the lower left corner
        // left/right boundary?
        if (right < wcLeft) { // left of WC left
            dx = Math.ceil((wcLeft - right) / w) * w;
        } else {
            if (left > wcLeft) { // not touching the left side
                dx = -Math.ceil((left - wcLeft) / w) * w;
            }
        }
        // top/bottom boundary
        if (top < wcBottom) { // Lower than the WC bottom
            dy = Math.ceil((wcBottom - top) / h) * h;
        } else {
            if (bottom > wcBottom) {  // not touching the bottom
                dy = -Math.ceil((bottom - wcBottom) / h) * h;
            }
        }

        // Step D: Save the original position of the tiling object.
        let sX = pos[0];
        let sY = pos[1];

        // Step E: Offset tiling object and modify the related position variables.
        xf.incXPosBy(dx);
        xf.incYPosBy(dy);
        right = pos[0] + (w / 2);
        top = pos[1] + (h / 2);

        // Step F: Determine the number of times to tile in the x and y directions.
        let nx = 1, ny = 1; // number of times to draw in the x and y directions
        nx = Math.ceil((wcRight - right) / w);
        ny = Math.ceil((wcTop - top) / h);

        // Step G: Loop through each location to draw a tile
        let cx = nx;
        let xPos = pos[0];
        while (ny >= 0) {
            cx = nx;
            pos[0] = xPos;
            while (cx >= 0) {
                this.mRenderComponent.draw(aCamera);
                xf.incXPosBy(w);
                --cx;
            }
            xf.incYPosBy(h);
            --ny;
        }

        // Step H: Reset the tiling object to its original position.
        pos[0] = sX;
        pos[1] = sY;
    }

    /**
     * Draws this TiledGameObject if visible and executes tiling if it should tile
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    draw(aCamera) {
        if (this.isVisible() && (this.mDrawRenderable)) {
            if (this.shouldTile()) {
                // find out where we should be drawing   
                this._drawTile(aCamera);
            } else {
                this.mRenderComponent.draw(aCamera);
            }
        }
    }
}

export default TiledGameObject;