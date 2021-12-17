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
        this.kBgLayer = "assets/bg_layer.png";
        this.kBgLayerNormal = "assets/bg_layer_normal.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;

        this.mBg = null;
        this.mBgL1 = null;

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

        // shadow support
        this.mBgShadow1 = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kBgNormal);
        engine.texture.load(this.kBgLayer);
        engine.texture.load(this.kBgLayerNormal);
        engine.texture.load(this.kMinionSpriteNormal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgNormal);
        engine.texture.unload(this.kBgLayer);
        engine.texture.unload(this.kBgLayerNormal);
        engine.texture.unload(this.kMinionSpriteNormal);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 1280, 720]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mHeroCam = new engine.Camera(
            vec2.fromValues(20, 30.5), // position of the camera
            14,                        // width of camera
            [0, 420, 300, 300],        // viewport (orgX, orgY, width, height)
            2
        );
        this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.9, 1]);
    

        // Step B: the lights
    this._initializeLights();   // defined in MyGame_Lights.js

    // Step C: the far Background
    let bgR = new engine.IllumRenderable(this.kBg, this.kBgNormal);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(30, 30);
    bgR.getXform().setPosition(0, 0);
    bgR.getMaterial().setSpecular([0.2, 0.1, 0.1, 1]);
    bgR.getMaterial().setShininess(50);
    bgR.getXform().setZPos(-5);
    bgR.addLight(this.mGlobalLightSet.getLightAt(1));   // only the directional light
    this.mBg = new engine.TiledGameObject(bgR);
        
    // Step D: the closer Background
    let i; 
    let bgR1 = new engine.IllumRenderable(this.kBgLayer, this.kBgLayerNormal);
    bgR1.getXform().setSize(30, 30);
    bgR1.getXform().setPosition(0, 0);
    bgR1.getXform().setZPos(-2);
    for (i = 0; i < 4; i++) {
        bgR1.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    bgR1.getMaterial().setSpecular([0.2, 0.2, 0.5, 1]);
    bgR1.getMaterial().setShininess(10);
    this.mBgL1 = new engine.TiledGameObject(bgR1);
    
    // 
    // the objects
    this.mIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 20, 30);
    this.mLgtHero = new Hero(this.kMinionSprite, null, 60, 50);
    this.mIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 25, 30);
    this.mLgtMinion = new Minion(this.kMinionSprite, null, 65, 25);
    for (i = 0; i < 4; i++) {
        this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
    }

    this.mMsg = new engine.FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(4, 12);
    this.mMsg.setTextHeight(3);

    this.mMatMsg = new engine.FontRenderable("Status Message");
    this.mMatMsg.setColor([1, 1, 1, 1]);
    this.mMatMsg.getXform().setPosition(4, 64);
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
    
    this._setupShadow();  // defined in my_game_shadow.js
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   
        this.mMatMsg.draw(this.mCamera);

        this._drawCamera(this.mHeroCam);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mCamera.update();  // to ensure proper interpolated movement effects
        this.mHeroCam.update();

        this.mBg.update();
        this.mBgL1.update();

        this.mIllumMinion.update(); // ensure sprite animation
        this.mLgtMinion.update();

        this.mIllumHero.update();  // allow keyboard control to move
        this.mLgtHero.update();

        let xf = this.mIllumHero.getXform();
        this.mCamera.panWith(xf, 0.7);
        this.mGlobalLightSet.getLightAt(2).set2DPosition(xf.getPosition());
        this.mHeroCam.setWCCenter(xf.getXPos(), xf.getYPos());
            
        this.mCamera.panWith(this.mLgtHero.getXform(), 0.7);
        this.mGlobalLightSet.getLightAt(3).set2DPosition(this.mLgtHero.getXform().getPosition());
        
        // control the selected light
        let msg = "L=" + this.mLgtIndex + " ";
        msg += this._lightControl();
        this.mMsg.setText(msg);

        msg = this._selectCharacter();
        msg += this._materialControl();
        this.mMatMsg.setText(msg);

    }

    // #region Local utility functions
    _drawCamera(camera) {
        // Step A: set up the View and Camera matrices
        camera.setViewAndCameraMatrix();

        // Step B: Now draws each primitive

        // always draw shadow first!
        this.mBg.draw(camera);
        this.mBgShadow1.draw(camera);
    
        this.mBlock1.draw(camera);
        this.mLgtMinion.draw(camera);
        this.mIllumMinion.draw(camera);
        this.mIllumHero.draw(camera);
        this.mBlock2.draw(camera);  
        this.mLgtHero.draw(camera);
        
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