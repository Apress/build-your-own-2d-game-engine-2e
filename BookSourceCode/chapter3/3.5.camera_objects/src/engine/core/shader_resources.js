/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../simple_shader.js";

 // Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
 }

function init() {
    createShaders();
}
function getConstColorShader() { return mConstColorShader; }

export {init, getConstColorShader}