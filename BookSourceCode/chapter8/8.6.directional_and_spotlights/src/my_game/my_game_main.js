/*
 * File: my_game_main.js 
 * Implementation of Scene methods for MyGame
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";


class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
        this.kBg = "assets/bg.png";
        this.kBgNormal = "assets/bg_normal.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.mMsg = null;
        this.mMatMsg = null;

        // the hero and the support objects
        this.mLgtHero = null;
        this.mIllumHero = null;

        this.mLgtMinion = null;
        this.mIllumMinion = null;

        this.mGlobalLightSet = null;

        this.mBlock1 = null;   // to verify switching between shaders is fine
        this.mBlock2 = null;

        this.mLgtIndex = 0;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kBgNormal);
        engine.texture.load(this.kMinionSpriteNormal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgNormal);
        engine.texture.unload(this.kMinionSpriteNormal);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // the light
        this._initializeLights();   // defined in MyGame_Lights.js

        // the Background
        let bgR = new engine.IllumRenderable(this.kBg, this.kBgNormal);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(100, 100);
        bgR.getXform().setPosition(50, 35);
        bgR.getMaterial().setSpecular([1, 0, 0, 1]);
        let i;
        for (i = 0; i < 4; i++) {
            bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        this.mBg = new engine.GameObject(bgR);

        // 
        // the objects
        this.mIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 15, 50);
        this.mLgtHero = new Hero(this.kMinionSprite, null, 80, 50);
        this.mIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 17, 15);
        this.mLgtMinion = new Minion(this.kMinionSprite, null, 87, 15);
        for (i = 0; i < 4; i++) {
            this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        }

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mMatMsg = new engine.FontRenderable("Status Message");
        this.mMatMsg.setColor([1, 1, 1, 1]);
        this.mMatMsg.getXform().setPosition(1, 73);
        this.mMatMsg.setTextHeight(3);

        this.mBlock1 = new engine.Renderable();
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new engine.Renderable();
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);

        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set up the camera and draw
        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera);
        this.mBlock1.draw(this.mCamera);
        this.mLgtMinion.draw(this.mCamera);
        this.mIllumHero.draw(this.mCamera);
        this.mBlock2.draw(this.mCamera);
        this.mLgtHero.draw(this.mCamera);
        this.mIllumMinion.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);   // draw last
        this.mMatMsg.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mCamera.update();  // to ensure proper interpolated movement effects

        this.mIllumMinion.update(); // ensure sprite animation
        this.mLgtMinion.update();

        this.mIllumHero.update();  // allow keyboard control to move

        // control the selected light
        let msg = "L=" + this.mLgtIndex + " ";
        msg += this._lightControl();
        this.mMsg.setText(msg);

        msg = this._selectCharacter();
        msg += this._materialControl();
        this.mMatMsg.setText(msg);

    }

    _selectCharacter() {
        // select which character to work with
        if (engine.input.isKeyClicked(engine.input.keys.Five)) {
            this.mSlectedCh = this.mIllumMinion;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "L:";
        }
        if (engine.input.isKeyClicked(engine.input.keys.Six)) {
            this.mSlectedCh = this.mIllumHero;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "H:";
        }
        return this.mSelectedChMsg;
    }
}

export default MyGame;