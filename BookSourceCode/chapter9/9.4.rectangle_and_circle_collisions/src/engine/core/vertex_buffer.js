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

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];


// reference to the texture coordinates for the square vertices in the gl context
let mGLTextureCoordBuffer = null;
function getTexCoord() { return mGLTextureCoordBuffer; }

// Second: define the corresponding texture coordinates
let mTextureCoordinates = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
];

// For line drawing: to support physics engine debugging
let mLineVertexBuffer = null;
function getLineVertexBuffer() { return mLineVertexBuffer; }
let mVerticesOfLine = [
     0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0
];

function cleanUp() {
    let gl = glSys.get();
    if (mGLVertexBuffer !== null) {
        gl.deleteBuffer(mGLVertexBuffer);
        mGLVertexBuffer = null;
    }

    if (mGLTextureCoordBuffer !== null) {
        gl.deleteBuffer(mGLTextureCoordBuffer);
        mGLTextureCoordBuffer = null;
    }

    if (mLineVertexBuffer !== null) {
        gl.deleteBuffer(mLineVertexBuffer);
        mLineVertexBuffer = null;
    }
}

function init() {
    let gl = glSys.get();

    // #region: support for the square vertices
    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
    // #endregion

    // #region: support texture UV coordinate
    //  Step  D: Allocate and store texture coordinates
    // Create a buffer on the gl context for texture coordinates
    mGLTextureCoordBuffer = gl.createBuffer();

    // Activate texture coordinate buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLTextureCoordBuffer);

    // Loads textureCoordinates into the mGLTextureCoordBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);
    // #endregion  

    // #region: support for line vertex positions 
    // Step A: Allocate and store vertex positions into the webGL context
    // Create a buffer on the gGL context for our vertex positions
    mLineVertexBuffer = gl.createBuffer();

    // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
    gl.bindBuffer(gl.ARRAY_BUFFER, mLineVertexBuffer);

    // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfLine), gl.STATIC_DRAW);
    // #endregion
}

export {
    init, cleanUp,
    get, getTexCoord, getLineVertexBuffer
}