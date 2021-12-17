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

// components
import * as input from "./components/input.js";
import * as physics from "./components/physics.js";
import * as particleSystem from "./components/particle_system.js";
import * as layer from "./components/layer.js";

// general utilities
import Scene from "./scene.js";
import Transform from "./utils/transform.js";
import BoundingBox from "./utils/bounding_box.js";
import { eBoundCollideStatus } from "./utils/bounding_box.js";
import Lerp from "./utils/lerp.js";
import LerpVec2 from "./utils/lerp_vec2.js";
import Oscillate from "./utils/oscillate.js";
import Shake from "./utils/shake.js";
import ShakeVec2 from "./utils/shake_vec2.js";
import Material from "./material.js";

// camera and related supports
import Camera from "./cameras/camera.js";

// renderables 
import Renderable from "./renderables/renderable.js";
import TextureRenderable from "./renderables/texture_renderable.js";
import SpriteRenderable from "./renderables/sprite_renderable.js";
import SpriteAnimateRenderable from "./renderables/sprite_animate_renderable.js";
import FontRenderable from "./renderables/font_renderable.js";
import LineRenderable from "./renderables/line_renderable.js";
import LightRenderable from "./renderables/light_renderable.js";
import IllumRenderable from "./renderables/illum_renderable.js";
import { eTexCoordArrayIndex } from "./renderables/sprite_renderable.js";
import { eAnimationType } from "./renderables/sprite_animate_renderable.js";

// game objects
import GameObject from "./game_objects/game_object.js";
import GameObjectSet from "./game_objects/game_object_set.js";
import TiledGameObject from "./game_objects/tiled_game_object.js";
import ParallaxGameObject from "./game_objects/parallax_game_object.js";

// light and lightSet
import Light from "./lights/light.js";
import LightSet from "./lights/light_set.js";
import { eLightType } from "./lights/light.js";

// Shadow support
import ShadowCaster from "./shadows/shadow_caster.js";
import ShadowReceiver from "./shadows/shadow_receiver.js";

// Rigid Shapes and Collision Info
import RigidShape from "./rigid_shapes/rigid_shape.js";
import RigidCircle from "./rigid_shapes/rigid_circle.js";
import RigidRectangle from "./rigid_shapes/rigid_rectangle.js";
import CollisionInfo from "./rigid_shapes/collision_info.js";

// particles
import Particle from "./particles/particle.js";
import ParticleSet from "./particles/particle_set.js";
import ParticleEmitter from "./particles/particle_emitter.js";

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
    layer.init();
}

function cleanUp() {
    layer.cleanUp();
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // clear to the color, stencil bit, and depth buffer bits
}


export default {
    // resource support
    audio, text, xml, texture, font, defaultResources,

    // engine components
    input, particleSystem, layer,

    // general utils 
    Lerp, LerpVec2, Oscillate, Shake, ShakeVec2,

    // Util classes
    Camera, Scene, Transform, BoundingBox, Material,
    
    // Renderables
    Renderable, TextureRenderable, SpriteRenderable, SpriteAnimateRenderable, 
    FontRenderable, LineRenderable, LightRenderable, IllumRenderable,

    // Game Objects
    GameObject, GameObjectSet,TiledGameObject, ParallaxGameObject,

    // Lights
    Light, LightSet,

    // Shadows
    ShadowCaster, ShadowReceiver,

    // Physics and RigidShapes
    physics, RigidShape, RigidCircle, RigidRectangle, CollisionInfo,

    // Particle support
    Particle, ParticleSet, ParticleEmitter,

    // constants
    eTexCoordArrayIndex, eAnimationType, eBoundCollideStatus, eLightType,

    // functions
    init, cleanUp, clearCanvas
}
