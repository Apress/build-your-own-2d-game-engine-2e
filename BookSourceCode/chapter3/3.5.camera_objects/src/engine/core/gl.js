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

function init(htmlCanvasID) {
    mCanvas = document.getElementById(htmlCanvasID);
    if (mCanvas == null)
        throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

    // Thanks to Arsen Mazmanyan (Birdman1104 @github) for pointing out that experimental-webgl2 has been deprecated
    // Get the webgl and binds to the Canvas area 
    // store the results to the instance variable mGL
    mGL = mCanvas.getContext("webgl2");

    if (mGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
}

export {init, get}