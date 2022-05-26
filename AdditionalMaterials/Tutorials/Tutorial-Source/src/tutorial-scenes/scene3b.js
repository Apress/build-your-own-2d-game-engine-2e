
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import FontRenderable from "../engine/renderables/font_renderable.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import SpriteAnimateRenderable, { eAnimationType } from "../engine/renderables/sprite_animate_renderable.js";


class Scene3b extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mGameObj = null;
        this.mRenderable = null;
        this.mMessage = null;
        this.mAnimatedObj = null;
        this.mAnimatedRenderable = null;

        this.kTexture = "assets/minion_spritesheet.png"
        this.kGameBGSong = "assets/BGClip.mp3";
        this.kGameCueSound = "assets/BlueLevel_Cue.WAV";
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
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

        this.mRenderable = new SpriteRenderable(this.kTexture);
        this.mRenderable.setElementPixelPositions(130,310,0,180);

        this.mAnimatedRenderable = new SpriteAnimateRenderable(this.kTexture);
        this.mAnimatedRenderable.setSpriteSequence(348,0,204,164,5,0);
        this.mAnimatedRenderable.setAnimationType(eAnimationType.eRight);
        this.mAnimatedRenderable.setAnimationSpeed(12);
        
        this.mGameObj = new GameObject(this.mRenderable);
        this.mGameObj.getXform().setSize(20,20);
        this.mGameObj.getXform().setPosition(70,70);

        this.mAnimatedObj = new GameObject(this.mAnimatedRenderable);
        this.mAnimatedObj.getXform().setSize(16,12)
        this.mAnimatedObj.getXform().setPosition(40,40);

        engine.defaultResources.setGlobalAmbientIntensity(4);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.mCamera.setViewAndCameraMatrix();

        this.mGameObj.draw(this.mCamera);
        this.mAnimatedObj.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        if(engine.input.isKeyPressed(engine.input.keys.A)){
            this.mGameObj.getXform().incXPosBy(-0.5);
            this.mRenderable.setElementPixelPositions(130,310,0,180)
        }
        if(engine.input.isKeyPressed(engine.input.keys.D)){
            this.mGameObj.getXform().incXPosBy(0.5);
            this.mRenderable.setElementPixelPositions(720,900,0,180)
        }
        if(engine.input.isKeyClicked(engine.input.keys.Q)){
            this.next();
        }
     
        this.mAnimatedObj.getXform().setXPos(this.mCamera.mouseWCX());
        this.mAnimatedObj.getXform().setYPos(this.mCamera.mouseWCY());

        
        this.mAnimatedObj.getRenderable().updateAnimation();
        this.mGameObj.update();
    }


    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene3b();
    myGame.start();
}