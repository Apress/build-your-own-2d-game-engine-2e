/*
 * File: core.js 
 *
 * The inner most core of the engine we will build
 */
"use strict"; 

// import all symbols that are exported from vertex_buffer.js, as symbols under the module "vertexBuffer"
//
import * as vertexBuffer from "./vertex_buffer.js";
import * as simpleShader from "./shader_support.js";

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

    // 1. initialize the buffer with the vertex positions for the unit square
    vertexBuffer.init(); // This function is defined in the vertex_buffer.js file

    // 2. now load and compile the vertex and fragment shaders
    simpleShader.init("VertexShader", "FragmentShader");
        // the two shaders are defined in the index.html file
        // init() function is defined in shader_support.js file
}

// Clears the draw area and draws one square
function drawSquare() {
    // Step A: Activate the shader
    simpleShader.activate();

    // Step B. draw with the above settings
    mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
}

// Clears the canvas area
function clearCanvas() {
    mGL.clear(mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
}

window.onload = function() {
    initWebGL("GLCanvas");     // Binds mGL context to WebGL functionality
    clearCanvas();      // Clears the GL area
    drawSquare();       // Draws one square
}

// export this symbol 
export {getGL}