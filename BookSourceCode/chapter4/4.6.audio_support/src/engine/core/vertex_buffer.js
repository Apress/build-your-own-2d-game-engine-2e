/*
 * File: vertex_buffer.js
 *  
 * defines the module that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gl context
 * 
 */
"use strict";

import * as glSys from "./gl.js";

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;
function get() { return mGLVertexBuffer; }
function cleanUp() { 
    if (mGLVertexBuffer !== null) {
        glSys.get().deleteBuffer(mGLVertexBuffer);
        mGLVertexBuffer = null;   
    }
}

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

function init() {
    let  gl = glSys.get();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();
       
    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}

export {init, get, cleanUp}