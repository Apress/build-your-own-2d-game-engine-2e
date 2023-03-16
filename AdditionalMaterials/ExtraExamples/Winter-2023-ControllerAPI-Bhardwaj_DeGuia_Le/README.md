# (Multi) Controller Support SDK
##### Epic Gamers: Brandon DeGuia, Pranshu Bhardwaj, Tony Le 
##### CSS 452

## Description: 
The current game engine only supports keyboard inputs and only a single keyboard at a time. We felt that controller input was missing. Our project allows the users to check for controller inputs, but not only for a single controller, but multiple. Our implementation made it very simple and similar to parsing keyboard inputs. In fact, the controller input code is also going to be located inside the input.js file of the game engine. 

## Our API
`function getNumControllers()`: function to get number of connected controllers `Return`: the number of controllers currently connected

`function isControllerButtonPressed(index, buttonCode)`: function to get if a button on a controller is pressed `index`: the int of the controller, i.e. index 0 is controller 1 `buttonCode`: value corresponding to the button on the controller `Return`: true if currently pressed, false if not pressed

`function isControllerButtonClicked(index, buttonCode)`: function to get if a button on a controller is clicked `index`: the int of the controller, i.e. index 0 is controller 1 `buttonCode`: value corresponding to the button on the controller `Return`: true on the frame the button is pressed, false any other time

`function isControllerButtonReleased(index, buttonCode)`: function to get if a button on a controller has been released `index`: the int of the controller, i.e. index 0 is controller 1 `buttonCode`: value corresponding to the button on the controller `Return`: true on the frame the button is released, false any other time

`function isJoystickActive(index, joystickCode)`: function to get if a joystick on a controller has moved away from the resting position `index`: the int of the controller, i.e. index 0 is controller 1 `joystickCode`: value corresponding to which joystick on the controller is moved `Return`: true if the joystick is not at (0, 0), false if joystick is at (0, 0)

`function getJoystickPosX(index, joystickCode)`: function to get the positional data of a joystick on a controller `index`: the int of the controller, i.e. index 0 is controller 1 `joystickCode`: value corresponding to which joystick on the controller is moved `Return`: a value from -1 to 1 corresponding to the X position of the given joystick on the given controller

`function getJoystickPosY(index, joystickCode)` : function to get the positional data of a joystick on a controller `index`: the int of the controller, i.e. index 0 is controller 1 `joystickCode`: value corresponding to which joystick on the controller is moved `Return`: a value from -1 to 1 corresponding to the Y position of the given joystick on the given controller

## Main Functions
`function update()`: calls function `controllerUpdate()`: loops through all connected controllers and checks the state of all buttons and joysticks. Updates internal arrays accordingly.

`function draw()`: nothing to do here! input does not draw!

`function init()`: calls function `controllerInit()`: sets up all internal arrays and hooks up event listeners to controllers

`function cleanup()`: nothing to do here! controller unplugging/plugging in is handled by event listeners

## File Organization
Rather than create a whole new file and update the internal structure of the game engine, functionality is located within `input.js`. <br><br>
What this means for users:
- No need to import any new kinds of input into the game engine, it's all 100% there in the normal input file!
- No need to set up anything while connecting a controller, because it's tied to `update()` in `input.js`, `update()` is constantly running and will automatically detect new controllers <br>

What this means for developers of the Game Engine:
- File is now split into four sections: `Main Functions`, `Keyboard Functions`, `Mouse Functions` and `Controller Functions`. Any functionality that belongs to a respective input system is located in that area of the file. Any area of the file that needs to reference another area (such as main functions) requries the functionality to be in its own function to keep organization clean
- All main functions of `input.js` now only contain a few lines of code. This keeps file organization clean. See example:
``` JavaScript
function update() {
    keyboardUpdate();
    if (mCanvas != null) {
        mouseUpdate();
    }
    controllerUpdate();
}
```


## Demo 
<b>NOTE</b>: For any demos accessed, AT LEAST ONE XBox controller with standard layout is required <br><br>
Preliminary Demo (Single Controller): https://btdeguia.github.io/CSS452Proj/ <br><br>
Final Demo (4-Player Pong): https://btdeguia.github.io/CSS452ProjFinal/ <br>
Developer Controls: all button bindings listed on the demo for the controller can be used by pressing the same key on a keyboard

## Conclusion 
### Strengths: 
- Allows the user to add an additional input type
- Allows for the implementation of local multiplayer games on a single machine 
- Very similar to the keyboard support to use
### Weakness: 
- Due to the limitations of the JavaScript Gamepad class, controllers retain their position in the 'player heirarchy' when unplugged/plugged in. For example, if two controllers are plugged in, and controller 0 is unplugged and plugged back in, it will still be in the 0 index. Controller 1 will not be promoted to index 0. This can cause problems with user implementation, but it is out of the developers' hands as this is a JavaScript built-in class they cannot modify.
- API ONLY supports XBox standard controller layout. No other controllers at this time


## Special Thanks/Acknowledgements
This project was created for CSS 452: Game Engine Development at the University of Washington, Bothell. Special thanks to Professor Kelvin Sung for advising this project<br><br>
The majority of this code is from Build Your Own 2D Game Engine, 2nd Edition. Credit goes to the authors. Check it out here: https://apress.github.io/build-your-own-2d-game-engine-2e/<br><br>
Some code was written using the JavaScript Gamepad API, documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API <br><br>