/*
 * File: audio.js
 *
 * logics for loading an audio file into the resource_map and
 * provides control of the loaded audio 
 */
"use strict";

import * as map from "../core/resource_map.js";
// functions from resource_map
let unload = map.unload;
let has = map.has;


let mAudioContext = null;
let mBackgroundAudio = null;

// volume control support
// https://www.davrous.com/2015/11/05/creating-fun-immersive-audio-experiences-with-web-audio/
// https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain
// https://www.html5rocks.com/en/tutorials/webaudio/positional_audio/
let mBackgroundGain = null;         // background volume
let mCueGain = null;        // cue/special effects volume
let mMasterGain = null;     // overall/master volume

let kDefaultInitGain = 0.1;

function cleanUp() {
    mAudioContext.close();
    mAudioContext = null;
}

function init() {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        mAudioContext = new AudioContext();

        // connect Master volume control
        mMasterGain = mAudioContext.createGain();
        mMasterGain.connect(mAudioContext.destination);
        // set default Master volume
        mMasterGain.gain.value = kDefaultInitGain;
         
        // connect Background volume control
        mBackgroundGain = mAudioContext.createGain();
        mBackgroundGain.connect(mMasterGain);
        // set default Background volume
        mBackgroundGain.gain.value = 1.0;
         
        // connect Cuevolume control
        mCueGain = mAudioContext.createGain();
        mCueGain.connect(mMasterGain);
        // set default Cue volume
        mCueGain.gain.value = 1.0;
    } catch (e) {
        throw new Error("Web Audio is not supported. Engine initialization failed.");
    }
}

function decodeResource(data) {
    return data.arrayBuffer();
}
function parseResource(data) {
    return mAudioContext.decodeAudioData(data);
}

function load(path) {
    return map.loadDecodeParse(path, decodeResource, parseResource);
}

function playCue(path, volume) {
    let source = mAudioContext.createBufferSource();
    source.buffer = map.get(path);
    source.start(0);

    // volume support for cue
    source.connect(mCueGain);
    mCueGain.gain.value = volume;
}

function playBackground(path, volume) {
    if (has(path)) {
        stopBackground();
        mBackgroundAudio = mAudioContext.createBufferSource();
        mBackgroundAudio.buffer = map.get(path);
        mBackgroundAudio.loop = true;
        mBackgroundAudio.start(0);

         // connect volume accordingly
         mBackgroundAudio.connect(mBackgroundGain);
         setBackgroundVolume(volume);
    }
}

/**
     * Set the volume of the background audio clip
     * @memberOf engine.audio
     * @param {float} volume
     * @returns {void}
     */
function setBackgroundVolume(volume) {
    if (mBackgroundGain !== null) {
        mBackgroundGain.gain.value = volume;
    }
}

/**
 * Increment the volume of the background audio clip
 * @memberOf engine.audio
 * @param {float} increment
 * @returns {void}
 */
function  incBackgroundVolume(increment) {
    if (mBackgroundGain !== null) {
        mBackgroundGain.gain.value += increment;

        // need this since volume increases when negative
        if (mBackgroundGain.gain.value < 0) {
            setBackgroundVolume(0);
        }
    }
}

/**
 * Set the Master volume
 * @memberOf engine.audio
 * @param {float} volume
 * @returns {void}
 */
function  setMasterVolume(volume) {
    if (mMasterGain !== null) {
        mMasterGain.gain.value = volume;
    }
}

/**
 * Increment the Master volume
 * @memberOf engine.audio
 * @param {float} increment
 * @returns {void}
 */
function  incMasterVolume(increment) {
    if (mMasterGain !== null) {
        mMasterGain.gain.value += increment;

        // need this since volume increases when negative
        if (mMasterGain.gain.value < 0) {
            mMasterGain.gain.value = 0;
        }
    }
}

function stopBackground() {
    if (mBackgroundAudio !== null) {
        mBackgroundAudio.stop(0);
        mBackgroundAudio = null;
    }
}

function isBackgroundPlaying() {
    return (mBackgroundAudio !== null);
}


export {init, cleanUp,
        has, load, unload,

        playCue,  

        playBackground, stopBackground, isBackgroundPlaying,
        setBackgroundVolume, incBackgroundVolume,

        setMasterVolume, incMasterVolume
    }