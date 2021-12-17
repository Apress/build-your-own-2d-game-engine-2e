/*
 * File: core.js 
 *
 * The inner most core of the engine we will build
 */
"use strict"; 

// variables
// 
// The graphical context to draw to
let mGL = null;
        // Convention: variable in a module: mName
function getGL() { return mGL; }

// initialize the WebGL
function initWebGL(htmlCanvasID) {
    let canvas = document.getElementById(htmlCanvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (mGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
    mGL.clearColor(0.0, 0.8, 0.0, 1.0);  // set the color to be cleared
}

// Clears the canvas area
function clearCanvas() {
    mGL.clear(mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
}

window.onload = function() {
    initWebGL("GLCanvas");     // Binds mGL context to WebGL functionality
    clearCanvas();       // Clears the GL area and draws one square
}