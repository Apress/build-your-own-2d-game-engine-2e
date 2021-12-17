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

        // the hero and the support objects
        this.mHero = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mGlobalLightSet = null;

        this.mBlock1 = null;   // to verify switching between shaders is fine
        this.mBlock2 = null;

        this.mLgtIndex = 0;     // the light to control
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
        let i;
        for (i = 0; i < 4; i++) {
            bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        this.mBg = new engine.GameObject(bgR);

        // 
        // the objects
        this.mHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal);
        this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(0));   // hero light
        this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light
        // Uncomment the following to see how light affects Dye
        //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1)); 
        //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2)); 

        this.mLMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 17, 15);
        this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1));   // LMinion light
        this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

        this.mRMinion = new Minion(this.kMinionSprite, null, 87, 15);
        this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2));   // RMinion light
        this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mBlock1 = new engine.Renderable();
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new engine.Renderable();
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set up the camera and draw
        this.mCamera.setViewAndCameraMatrix();
        // Step B: Now draws each primitive
        this.mBg.draw(this.mCamera);
        this.mBlock1.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mBlock2.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        
        this.mMsg.draw(this.mCamera);   // draw last
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let msg = "Light=" + this.mLgtIndex + " ";

        this.mCamera.update();  // to ensure proper interpolated movement effects
    
        this.mLMinion.update(); // ensure sprite animation
        this.mRMinion.update();
    
        this.mHero.update();  // allow keyboard control to move
    
        // control the selected light
        msg += this._lightControl();
    
        this.mMsg.setText(msg);
    

    }
}

export default MyGame;