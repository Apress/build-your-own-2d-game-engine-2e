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
import * as font from "./resources/font.js";
import * as defaultResources from "./resources/default_resources.js";

// general utilities
import * as input from "./input.js";
import Scene from "./scene.js";
import Transform from "./utils/transform.js";
import BoundingBox from "./utils/bounding_box.js";
import { eBoundCollideStatus } from "./utils/bounding_box.js";
import Lerp from "./utils/lerp.js";
import LerpVec2 from "./utils/lerp_vec2.js";
import Oscillate from "./utils/oscillate.js";
import Shake from "./utils/shake.js";
import ShakeVec2 from "./utils/shake_vec2.js";

// camera and related supports
import Camera from "./cameras/camera.js";

// renderables 
import Renderable from "./renderables/renderable.js";
import TextureRenderable from "./renderables/texture_renderable.js";
import SpriteRenderable from "./renderables/sprite_renderable.js";
import SpriteAnimateRenderable from "./renderables/sprite_animate_renderable.js";
import FontRenderable from "./renderables/font_renderable.js";
import { eTexCoordArrayIndex } from "./renderables/sprite_renderable.js";
import { eAnimationType } from "./renderables/sprite_animate_renderable.js";

// game objects
import GameObject from "./game_objects/game_object.js";
import GameObjectSet from "./game_objects/game_object_set.js";

// local to this file only
import * as glSys from "./core/gl.js";
import * as vertexBuffer from "./core/vertex_buffer.js";
import * as shaderResources from "./core/shader_resources.js";
import * as loop from "./core/loop.js";

// general engine utilities
function init(htmlCanvasID) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    input.init(htmlCanvasID);
    audio.init();
    shaderResources.init();
    defaultResources.init();
}

function cleanUp() {
    loop.cleanUp();
    shaderResources.cleanUp();
    defaultResources.cleanUp();
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
    audio, text, xml, texture, font, defaultResources,

    // input support
    input,

    // general utils 
    Lerp, LerpVec2, Oscillate, Shake, ShakeVec2,

    // Util classes
    Camera, Scene, Transform, BoundingBox,  
    
    // Renderables
    Renderable, TextureRenderable, SpriteRenderable, SpriteAnimateRenderable, FontRenderable,

    // Game Objects
    GameObject, GameObjectSet,

    // constants
    eTexCoordArrayIndex, eAnimationType, eBoundCollideStatus,

    // functions
    init, cleanUp, clearCanvas
}
