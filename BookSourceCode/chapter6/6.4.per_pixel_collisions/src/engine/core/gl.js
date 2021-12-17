/*
 * File: gl.js
 *  
 * handles initialization with gl
 * 
 */
"use strict";

let mCanvas = null;
let mGL = null;

function get() { return mGL; }

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

function init(htmlCanvasID) {
    mCanvas = document.getElementById(htmlCanvasID);
    if (mCanvas == null)
        throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = mCanvas.getContext("webgl2", {alpha: false}) || mCanvas.getContext("experimental-webgl2", {alpha: false});

    if (mGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }

    // Allows transparency with textures.
    mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
    mGL.enable(mGL.BLEND);
    
    // Set images to flip y axis to match the texture coordinate space.
    mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);

}

export {get, init, cleanUp}