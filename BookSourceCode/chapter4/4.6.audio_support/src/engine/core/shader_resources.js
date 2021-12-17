/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../simple_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";
 
 // Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
 }

function cleanUp() {
    mConstColorShader.cleanUp();
    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }

export {init, cleanUp, getConstColorShader}