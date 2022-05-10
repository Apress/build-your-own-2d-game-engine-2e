/*
 * File: gl.js
 *  
 * handles initialization with gl
 * 
 */
"use strict";


let mCanvas = null;
let mGL = null;
/**
 * Handles the WebGL2 context for the engine
 * <p>Found in Chapter 3, page 67 of the textbook</p>
 * Example:
 * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter3/3.1.renderable_objects/index.html 3.1 Renderable Objects}
 * 
 * @module
 */

/**
 * Returns the WebGL2 context for the canvas
 * @static
 * @returns {WebGL2RenderingContext} rendering context
 */
function get() { return mGL; }

/**
 * Closes the canvas and the rendering context with a shut down message
 * @static 
 */
function cleanUp() {
    if ((mGL == null) || (mCanvas == null))
        throw new Error("Engine cleanup: system is not initialized.");

    mGL = null;

    // let the user know
    mCanvas.style.position = "fixed";
    mCanvas.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
    mCanvas = null;
    
    document.body.innerHTML += "<br><br><h1>End of Game</h1><h1>GL System Shut Down</h1>";

}
/**
 * Initializes the canvas and rendering context
 * @static
 * @param {string} htmlCanvasID - the id of the canvas element
 * @returns {void} returns early if the WebGL2 context is null
 */
function init(htmlCanvasID) {
    mCanvas = document.getElementById(htmlCanvasID);
    if (mCanvas == null)
        throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = mCanvas.getContext("webgl2", {alpha: false, depth: true, stencil: true}) || 
          mCanvas.getContext("experimental-webgl2", {alpha: false, depth: true, stencil: true});

    if (mGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }

    // Allows transparency with textures.
    mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
    mGL.enable(mGL.BLEND);
    
    // Set images to flip y axis to match the texture coordinate space.
    mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);

    // make sure depth testing is enabled
    mGL.enable(mGL.DEPTH_TEST);
    mGL.depthFunc(mGL.LEQUAL);
}

/**
 * Begins drawing using a stencil
 * @static
 * @param {int} bit - reference value for the stencil test
 * @param {GLuint} mask - bit-wise mask that is used in comparison
 */
function beginDrawToStencil(bit, mask)
{
    mGL.clear(mGL.STENCIL_BUFFER_BIT);
    mGL.enable(mGL.STENCIL_TEST);
    mGL.colorMask(false, false, false, false);
    mGL.depthMask(false);
    mGL.stencilFunc(mGL.NEVER, bit, mask);
    mGL.stencilOp(mGL.REPLACE, mGL.KEEP, mGL.KEEP);
    mGL.stencilMask(mask);
}

/**
 * Sets the rendering context to use normal drawing method
 * @static
 * @param {int} bit - reference value for the stencil test
 * @param {GLuint} mask - bit-wise mask that is used in comparison
 */
function endDrawToStencil(bit, mask)
{
    mGL.depthMask(mGL.TRUE);
    mGL.stencilOp(mGL.KEEP, mGL.KEEP, mGL.KEEP);
    mGL.stencilFunc(mGL.EQUAL, bit, mask);
    mGL.colorMask(true, true, true, true);
}

/**
 * Disables stencil rendering
 * @static
 */
function disableDrawToStencil() {
    mGL.disable(mGL.STENCIL_TEST);
}

export {
    get, init, cleanUp,

    // stencil support
    disableDrawToStencil, beginDrawToStencil, endDrawToStencil
}