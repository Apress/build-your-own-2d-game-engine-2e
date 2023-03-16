/*
 * File: input.js
 *  
 * interfaces with HTML5 to to receive keyboard events
 * 
 * For a complete list of key codes, see
 * https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 * 
 * 
 * Modified by Brandon DeGuia, Pranshu Bhardwaj, and Tony Le for CSS 452 Final Project Winter 2023
 * Now supports inputs from an XBox standard layout controller
 * 
 * For documentation on how this file works, see
 * https://github.com/btdeguia/CSS452ProjFinal 
 * 
 * For documentation on how the JavaScript Gamepad class works, see
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API 
 */
"use strict";

// MAIN FUNCTIONS **************************************************************************************************************

function cleanUp() {}  // nothing to do for now

function init(canvasID) {
    keyboardInit();
    if (canvasID != null) {
        mouseInit(canvasID);
    } else {
        console.log("Current Game Engine version does not support mouse input");
    }
    controllerInit();
}

function update() {
    keyboardUpdate();
    if (mCanvas != null) { // don't get mouse data if it is not supported
        mouseUpdate();
    }
    controllerUpdate();
}

// KEYBOARD FUNCTIONS **********************************************************************************************************

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

// Previous key state
let mKeyPreviousState = []; // a new array
// The pressed keys.
let  mIsKeyPressed = [];
// Click events: once an event is set, it will remain there until polled
let  mIsKeyClicked = [];

// keyboard main funcitons
function keyboardInit() {
    let i;
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyPressed[i] = false;
        mKeyPreviousState[i] = false;
        mIsKeyClicked[i] = false;
    }

    // register handlers 
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
}

function keyboardUpdate() {
    let i;
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }
}

// keyboard event handlers
function onKeyDown(event) {
    mIsKeyPressed[event.keyCode] = true;
}

function onKeyUp(event) {
    mIsKeyPressed[event.keyCode] = false;
}

// Function for GameEngine programmer to test if a key is pressed down
function isKeyPressed(keyCode) {
    return mIsKeyPressed[keyCode];
}

function isKeyClicked(keyCode) {
    return mIsKeyClicked[keyCode];
}

// MOUSE FUNCTIONS *************************************************************************************************************

// mouse button enums
const eMouseButton = Object.freeze({
    eLeft: 0,
    eMiddle: 1,
    eRight: 2
});

 // Support mouse
 let mCanvas = null;
 let mButtonPreviousState = [];
 let mIsButtonPressed = [];
 let mIsButtonClicked = [];
 let mMousePosX = -1;
 let mMousePosY = -1;

// mouse main functions
function mouseInit(canvasID) {
    for (let i = 0; i < 3; i++) {
        mButtonPreviousState[i] = false;
        mIsButtonPressed[i] = false;
        mIsButtonClicked[i] = false;
    }

    // register handlers
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    mCanvas = document.getElementById(canvasID);
}

function mouseUpdate() {
    // update mouse input state
    for (let i = 0; i < 3; i++) {
        mIsButtonClicked[i] = (!mButtonPreviousState[i]) && mIsButtonPressed[i];
        mButtonPreviousState[i] = mIsButtonPressed[i];
    }
}

// mouse event handlers
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

// Functions for query mouse button state and position
function isButtonPressed(button) {
    return mIsButtonPressed[button];
}

function isButtonClicked(button) {
    return mIsButtonClicked[button];
}

function getMousePosX() { return mMousePosX; }
function getMousePosY() { return mMousePosY; }

// CONTROLLER FUNCTIONS ********************************************************************************************************

const buttons = {
    // letter buttons
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    // bumper buttons (above triggers)
    LeftBumper: 4,
    RightBumper: 5,
    // trigger buttons (move this into its own array later)
    LeftTrigger: 6,
    RightTrigger: 7,
    // control buttons
    Back: 8,
    Start: 9,
    // joysticks can be pressed inwards
    LeftJoystickButton: 10,
    RightJoystickButton: 11,
    // plus pad
    PlusPadUp: 12,
    PlusPadDown: 13,
    PlusPadLeft: 14,
    PlusPadRight: 15,


    LastButtonCode: 15
}

// left = 0 and right = 1 is a convention for development sake
const joysticks = {
    Left: 0,
    Right: 1
}

// joystick data is an array of length 4
// private enum so developers do not confuse which index is which joystick
const joysticks_private = {
    LeftX: 0,
    LeftY: 1,
    RightX: 2,
    RightY: 3,

    LastJoystickCode: 3
}

const triggers = {
    LeftTrigger: 6,
    RightTrigger: 7
}

let controllers = [];

// NOTE: all below arrays will be MULTI-DIMENSIONAL
// previous state for buttons
let mControllerPreviousState = [];
// if button is currently being pressed
let  mIsControllerButtonPressed = [];
// if button was clicked that frame
let  mIsControllerButtonClicked = [];
// if button was released that frame
let mIsControllerButtonReleased = [];
// x y positions of the joysticks
let mJoystickState =  [];

// number of controllers
let mNumControllers = 0;

// controller main functions
function controllerInit() {
    for (let i = 0; i < 4; i++) {
        mIsControllerButtonPressed[i] = [];
        mIsControllerButtonClicked[i] = [];
        mIsControllerButtonReleased[i] = [];
        mJoystickState[i] = [];
        mControllerPreviousState[i] = [];
    }


    window.addEventListener("gamepadconnected", onControllerConnect);
    window.addEventListener("gamepaddisconnected", onControllerDisconnect);
}

function controllerUpdate() {
    // get controller state data every tick
    controllers = navigator.getGamepads();
    // loop supports 4 controllers, arrays only support 1 controller
    // implementation can be extended to multiple controllers by adding multi-dimensional arrays
    for (let i = 0; i < controllers.length; i++) {
        if (controllers[i] == null) {
            continue;
        }
        // get all controller state data
        for (let j = 0; j < controllers[i].buttons.length; j++) {
            mIsControllerButtonPressed[i][j] = controllers[i].buttons[j].pressed; // button pressed

            mIsControllerButtonClicked[i][j] = (!mControllerPreviousState[i][j]) && mIsControllerButtonPressed[i][j]; // button clicked
            mIsControllerButtonReleased[i][j] = mControllerPreviousState[i][j] && !mIsControllerButtonPressed[i][j]; // button released MUST be saved HERE or else previousState and isPressed will NEVER line up!!
            mControllerPreviousState[i][j] = mIsControllerButtonPressed[i][j]; // previous state
        }
        // get all controller joystick data
        for (let j = 0; j <= joysticks_private.LastJoystickCode; j++) {
            mJoystickState[i][j] = controllers[i].axes[j];
        }
    }
}

// controller event handlers
function onControllerConnect(event) {
    console.log(event.gamepad.id + " connected");

    // init all arrs for this controller
    let buttonPressedArr = [];
    let buttonClickedArr = [];
    let buttonReleaseArr = [];
    let joystickStateArr = [];
    let previousStateArr = [];

    // base population for arrs for this controller
    for (let i = 0; i <= buttons.LastButtonCode; i++) {
        buttonPressedArr[i] = false;
        buttonClickedArr[i] = false;
        buttonReleaseArr[i] = false;
        previousStateArr[i] = false;
    }
    for (let i = 0; i <= joysticks_private.LastJoystickCode; i++) {
        joystickStateArr[i] = 0;
    }

    // insert arrs into multi-dimensional arr
    mIsControllerButtonPressed[event.gamepad.index] = buttonPressedArr;
    mIsControllerButtonClicked[event.gamepad.index] = buttonClickedArr;
    mIsControllerButtonReleased[event.gamepad.index] = buttonReleaseArr;
    mJoystickState[event.gamepad.index] = joystickStateArr;
    mControllerPreviousState[event.gamepad.index] = previousStateArr;
    mNumControllers++;
}

function onControllerDisconnect(event) {
    console.log(event.gamepad.id + " disconnected");
        
    // remove all entries for this controller
    mIsControllerButtonPressed[event.gamepad.index] = [];
    mIsControllerButtonClicked[event.gamepad.index] = [];
    mIsControllerButtonReleased[event.gamepad.index] = [];
    mJoystickState[event.gamepad.index] = [];
    mControllerPreviousState[event.gamepad.index] = [];

    mNumControllers--;
} 

// get number of CONNECTED controllers
function getNumControllers() {
    return mNumControllers;
}

// Functions for query controller button state and joystick position
function isControllerButtonPressed(index, buttonCode) {
    // if no controllers or invalid index, return null
    if (getNumControllers() == 0) {
        return null;
    }
    if (index >= getNumControllers()) {
        return null;
    }

    return mIsControllerButtonPressed[index][buttonCode];
}

function isControllerButtonClicked(index, buttonCode) {
    // if no controllers or invalid index, return null
    if (getNumControllers() == 0) {
        return null;
    }
    if (index >= getNumControllers()) {
        return null;
    }

    return mIsControllerButtonClicked[index][buttonCode];
}

function isControllerButtonReleased(index, buttonCode) {
    // if no controllers or invalid index, return null
    if (getNumControllers() == 0) {
        return null;
    }
    if (index >= getNumControllers()) {
        return null;
    }

    return mIsControllerButtonReleased[index][buttonCode];
}

function isJoystickActive(index, joystickCode) {
    let x = getJoystickPosX(index, joystickCode);
    let y = getJoystickPosY(index, joystickCode);
    // padding is needed because analog joysticks can never be 0 exactly
    // joystick is arbitrarily classified as 'active' when it is above this threshold
    if (
        x > 0.1 ||
        x < -0.1 ||
        y > 0.1 ||
        y < -0.1
    ) {
        return true;
    }
    return false;
}

function getJoystickPosX(index, joystickCode) {
    // if no controllers or invalid index, return null instead of positional data
    if (getNumControllers() == 0) {
        return null;
    }
    if (index >= getNumControllers()) {
        return null;
    }

    let val = 0;
    if (joystickCode == 0) {
        val = mJoystickState[index][joysticks_private.LeftX]
    } else if (joystickCode == 1) {
       val =  mJoystickState[index][joysticks_private.RightX];
    }
    return val;
}

function getJoystickPosY(index, joystickCode) {
    // if no controllers or invalid index, return null instead of positional data
    if (getNumControllers() == 0) {
        return null;
    }
    if (index >= getNumControllers()) {
        return null;
    }
    
    let val = 0;
    if (joystickCode == 0) {
        val = mJoystickState[index][joysticks_private.LeftY]
    } else if (joystickCode == 1) {
       val =  mJoystickState[index][joysticks_private.RightY];
    }
    return -val;
}


export {
    init, cleanUp, update, 
    
    keys,
    isKeyClicked,
    isKeyPressed,

    eMouseButton,
    isButtonClicked,
    isButtonPressed,
    getMousePosX,
    getMousePosY,

    buttons,
    joysticks,
    isControllerButtonClicked,
    isControllerButtonPressed,
    isControllerButtonReleased,
    isJoystickActive,
    getJoystickPosX,
    getJoystickPosY,
    getNumControllers
}
