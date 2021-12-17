/*
 * File: index.js
 *  
 * serves as central export of the entire engine
 * client programs can simply import this file 
 * for all symbols defined in the engine
 * 
 */
"use strict";

// resources
import * as audio from "./resources/audio.js";
import * as text from "./resources/text.js";
import * as xml from "./resources/xml.js";
import * as texture from "./resources/texture.js";

// general utilities
import * as input from "./input.js";
import Camera from "./camera.js";
import Scene from "./scene.js";
import Transform from "./transform.js";

// renderables 
import Renderable from "./renderables/renderable.js";
import TextureRenderable from "./renderables/texture_renderable.js";

// local to this file only
import * as glSys from "./core/gl.js";
import * as vertexBuffer from "./core/vertex_buffer.js";
import * as shaderResources from "./core/shader_resources.js";
import * as loop from "./core/loop.js";

// general engine utilities
function init(htmlCanvasID) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    input.init();
    audio.init();
    shaderResources.init();
}

function cleanUp() {
    loop.cleanUp();
    shaderResources.cleanUp();
    audio.cleanUp();
    input.cleanUp();
    vertexBuffer.cleanUp();
    glSys.cleanUp();
}

function clearCanvas(color) {
    let gl = glSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}


export default {
    // resource support
    audio, text, xml, texture,

    // input support
    input,

    // Util classes
    Camera, Scene, Transform, 
        
    // Renderables
    Renderable, TextureRenderable,

    // functions
    init, cleanUp, clearCanvas
}
