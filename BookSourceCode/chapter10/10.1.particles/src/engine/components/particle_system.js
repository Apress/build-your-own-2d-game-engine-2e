/*
 * File: particle_system.js 
 * Particle System support
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

let mSystemAcceleration = [30, -50.0];   
    
function getSystemAcceleration() { return vec2.clone(mSystemAcceleration); }
function setSystemAcceleration(x, y) {
    mSystemAcceleration[0] = x;
    mSystemAcceleration[1] = y;
}

export {getSystemAcceleration, setSystemAcceleration}
