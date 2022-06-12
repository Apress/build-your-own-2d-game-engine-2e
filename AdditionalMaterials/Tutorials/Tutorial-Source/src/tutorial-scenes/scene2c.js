
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";


class Scene2c extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mGameObj = null;
        this.mRenderable = null;
        this.kTexture = "assets/minion_portal.png";
        this.kGameBGSong = "assets/BGClip.mp3";
        this.kGameCueSound = "assets/BlueLevel_Cue.wav";
    }

    load() {
        engine.texture.load(this.kTexture);
        engine.audio.load(this.kGameBGSong);
        engine.audio.load(this.kGameCueSound);
    }

    unload() {
        engine.texture.unload(this.kTexture);
        engine.audio.unload(this.kGameBGSong);
        engine.audio.unload(this.kGameCueSound);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

        this.mRenderable = new TextureRenderable(this.kTexture);

        this.mGameObj = new GameObject(this.mRenderable);
        this.mGameObj.getXform().setSize(20,20);
        this.mGameObj.getXform().setPosition(70,70);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // canvas color
        this.mCamera.setViewAndCameraMatrix();

       this.mGameObj.draw(this.mCamera)

    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        if(engine.input.isKeyPressed(engine.input.keys.A)){
            this.mGameObj.getXform().incXPosBy(-0.5);
        }
        if(engine.input.isKeyPressed(engine.input.keys.D)){
            this.mGameObj.getXform().incXPosBy(0.5);
        }
        if(engine.input.isKeyClicked(engine.input.keys.Q)){
            this.next();
        }
        this.mGameObj.update();

        if(engine.input.isKeyClicked(engine.input.keys.P)){
            if(engine.audio.isBackgroundPlaying()){
                engine.audio.stopBackground();
            }else{
                engine.audio.playBackground(this.kGameBGSong,0.5);
            }
        }
        if(engine.input.isButtonClicked(engine.input.eMouseButton.eLeft)){
            engine.audio.playCue(this.kGameCueSound,0.5);
        }
    }


    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene2c();
    myGame.start();
}