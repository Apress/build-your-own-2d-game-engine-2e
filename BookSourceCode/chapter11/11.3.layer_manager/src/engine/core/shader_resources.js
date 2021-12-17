/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import LineShader from "../shaders/line_shader.js";
import LightShader from "../shaders/light_shader.js";
import IllumShader from "../shaders/illum_shader.js";
import ShadowCasterShader from "../shaders/shadow_caster_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";
 
// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;
let mSpriteShader = null;

// Line Shader
let kLineFS = "src/glsl_shaders/line_fs.glsl";        // Path to the Line FragmentShader
let mLineShader = null;

// Light Shader
let kLightFS = "src/glsl_shaders/light_fs.glsl";  // Path to the Light FragmentShader
let mLightShader = null;

// Illumination Shader
let kIllumFS = "src/glsl_shaders/illum_fs.glsl";  // Path to the Illumination FragmentShader
let mIllumShader = null;

// Shadow shaders
let kShadowReceiverFS = "src/glsl_shaders/shadow_receiver_fs.glsl";  // Path to the FragmentShader
let mShadowReceiverShader = null;
let kShadowCasterFS = "src/glsl_shaders/shadow_caster_fs.glsl";  // Path to the FragmentShader
let mShadowCasterShader = null;

// Particle Shader
let kParticleFS = "src/glsl_shaders/particle_fs.glsl";
let mParticleShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mLineShader =  new LineShader(kSimpleVS, kLineFS);
    mLightShader = new LightShader(kTextureVS, kLightFS);
    mIllumShader = new IllumShader(kTextureVS, kIllumFS);
    mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
    mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
    mParticleShader = new TextureShader(kTextureVS, kParticleFS);
}

function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();
    mLineShader.cleanUp();
    mLightShader.cleanUp();
    mIllumShader.cleanUp();
    mShadowReceiverShader.cleanUp();
    mShadowCasterShader.cleanUp();
    mParticleShader.cleanUp();

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
    text.unload(kLineFS);
    text.unload(kLightFS);
    text.unload(kIllumFS);
    text.unload(kShadowCasterFS);
    text.unload(kShadowReceiverFS);
    text.unload(kParticleFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS),
                text.load(kTextureFS),
                text.load(kTextureVS),
                text.load(kLineFS),
                text.load(kLightFS),
                text.load(kIllumFS),
                text.load(kShadowCasterFS),
                text.load(kShadowReceiverFS),
                text.load(kParticleFS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }
function getSpriteShader() { return mSpriteShader; }
function getLineShader() { return mLineShader; }
function getLightShader() { return mLightShader; }
function getIllumShader() { return mIllumShader; }
function getShadowReceiverShader() { return mShadowReceiverShader; }
function getShadowCasterShader() { return mShadowCasterShader; }
function getParticleShader() { return mParticleShader }

export {init, cleanUp, 
        getConstColorShader, getTextureShader, getSpriteShader, getLineShader,
        getLightShader, getIllumShader, getShadowReceiverShader, getShadowCasterShader,
        getParticleShader}