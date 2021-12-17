/*
 * File: input.js
 *  
 * interfaces with HTML5 to to receive keyboard events
 * 
 * For a complete list of key codes, see
 * https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 */
"use strict";

// Key code constants
const keys = {
    // arrows
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,

    // space bar
    Space: 32,

    // numbers 
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five : 53,
    Six : 54,
    Seven : 55,
    Eight : 56,
    Nine : 57,

    // Alphabets
    A : 65,
    B : 66,
    C : 67,
    D : 68,
    E : 69,
    F : 70,
    G : 71,
    H : 72,
    I : 73,
    J : 74,
    K : 75,
    L : 76,
    M : 77,
    N : 78,
    O : 79,
    P : 80,
    Q : 81,
    R : 82,
    S : 83,
    T : 84,
    U : 85,
    V : 86,
    W : 87,
    X : 88,
    Y : 89,
    Z : 90,

    LastKeyCode: 222
}

// mouse button enums
const eMouseButton = Object.freeze({
    eLeft: 0,
    eMiddle: 1,
    eRight: 2
});

// Previous key state
let mKeyPreviousState = []; // a new array
// The pressed keys.
let  mIsKeyPressed = [];
// Click events: once an event is set, it will remain there until polled
let  mIsKeyClicked = [];

// Event handler functions
function onKeyDown(event) {
    mIsKeyPressed[event.keyCode] = true;
}

function onKeyUp(event) {
    mIsKeyPressed[event.keyCode] = false;
}

 // Support mouse
let mCanvas = null;
let mButtonPreviousState = [];
let mIsButtonPressed = [];
let mIsButtonClicked = [];
let mMousePosX = -1;
let mMousePosY = -1;

function onMouseMove(event) {
    let inside = false;
    let bBox = mCanvas.getBoundingClientRect();
    // In Canvas Space now. Convert via ratio from canvas to client.
    let x = Math.round((event.clientX - bBox.left) * (mCanvas.width / bBox.width));
    let y = Math.round((event.clientY - bBox.top) * (mCanvas.height / bBox.height));

    if ((x >= 0) && (x < mCanvas.width) &&
        (y >= 0) && (y < mCanvas.height)) {
        mMousePosX = x;
        mMousePosY = mCanvas.height - 1 - y;
        inside = true;
    }
    return inside;
}

function onMouseDown(event) {
    if (onMouseMove(event)) {
        mIsButtonPressed[event.button] = true;
    }
}

function onMouseUp(event) {
    onMouseMove(event);
    mIsButtonPressed[event.button] = false;
}

function cleanUp() {}  // nothing to do for now

function init(canvasID) {
    let i;

    // keyboard support
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyPressed[i] = false;
        mKeyPreviousState[i] = false;
        mIsKeyClicked[i] = false;
    }

    // register handlers 
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    // Mouse support
    for (i = 0; i < 3; i++) {
        mButtonPreviousState[i] = false;
        mIsButtonPressed[i] = false;
        mIsButtonClicked[i] = false;
    }
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    mCanvas = document.getElementById(canvasID);
}

function update() {
    let i;
    // update keyboard input state
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }

    // update mouse input state
    for (i = 0; i < 3; i++) {
        mIsButtonClicked[i] = (!mButtonPreviousState[i]) && mIsButtonPressed[i];
        mButtonPreviousState[i] = mIsButtonPressed[i];
    }
}

// Function for GameEngine programmer to test if a key is pressed down
function isKeyPressed(keyCode) {
    return mIsKeyPressed[keyCode];
}

function isKeyClicked(keyCode) {
    return mIsKeyClicked[keyCode];
}

// Functions for query mouse button state and position
function isButtonPressed(button) {
    return mIsButtonPressed[button];
}

function isButtonClicked(button) {
    return mIsButtonClicked[button];
}
function getMousePosX() { return mMousePosX; }
function getMousePosY() { return mMousePosY; }

export {
    keys, eMouseButton,
    
    init, cleanUp, update, 

    // keyboard
    isKeyClicked, isKeyPressed,

    // mouse
    isButtonClicked, isButtonPressed, getMousePosX, getMousePosY
}
