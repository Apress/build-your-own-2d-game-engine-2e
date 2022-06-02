
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import SpriteAnimateRenderable, { eAnimationType } from "../engine/renderables/sprite_animate_renderable.js";
import LightRenderable from "../engine/renderables/light_renderable.js";
import Light, { eLightType } from "../engine/lights/light.js";
import IllumRenderable from "../engine/renderables/illum_renderable.js";
import ShadowReceiver from "../engine/shadows/shadow_receiver.js";

class Scene6a extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mMinionObj = null;
        this.mBgObj = null;
        this.mPointLight = null;
        this.mRockObj = null;
        this.mSpotLight = null;
        this.mDirectionLight = null;
        this.mShadow = null;
      
        this.kTexture = "assets/minion_spritesheet.png";
        this.kBackground = "assets/bg.png";
        this.kBackgroundNormal = "assets/bg_normal.png";
        this.kRockTexture = "assets/asteroids.png";
        this.kRockNormal = "assets/asteroidsNormal.png";
    }

    load() {
        engine.texture.load(this.kTexture);
        engine.texture.load(this.kBackground);
        engine.texture.load(this.kBackgroundNormal);
        engine.texture.load(this.kRockTexture);
        engine.texture.load(this.kRockNormal);
    }

    unload() {
        engine.texture.unload(this.kTexture); 
        engine.texture.unload(this.kBackground);
        engine.texture.unload(this.kBackgroundNormal);
        engine.texture.unload(this.kRockTexture);
        engine.texture.unload(this.kRockNormal);
    }

    init() {
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mBgObj = new GameObject(new IllumRenderable(this.kBackground,this.kBackgroundNormal));
        this.mBgObj.getXform().setSize(100,100);
        this.mBgObj.getXform().setPosition(50,50);
        this.mBgObj.getXform().setZPos(0);

        this.mMinionObj = new GameObject(new LightRenderable(this.kTexture));
        this.mMinionObj.getRenderable().setElementPixelPositions(130,310,0,180);
        this.mMinionObj.getXform().setSize(20,20);
        this.mMinionObj.getXform().setPosition(50,50);
        this.mMinionObj.getXform().setZPos(1);

        this.mRockObj = new GameObject(new IllumRenderable(this.kRockTexture,this.kRockNormal));
        this.mRockObj.getRenderable().setSpriteSequence(64,0,61,64,59,2);
        this.mRockObj.getRenderable().setAnimationSpeed(2);
        this.mRockObj.getRenderable().setAnimationType(eAnimationType.eRight);
        this.mRockObj.getXform().setSize(10,10);
        this.mRockObj.getXform().setPosition(30,70);
        this.mRockObj.getXform().setZPos(1);

        // create the light and set properties
        this.mPointLight = new Light();
        this.mPointLight.setLightType(eLightType.ePointLight);
        this.mPointLight.setColor([1,1,1,1]);
        this.mPointLight.setXPos(50);
        this.mPointLight.setYPos(50);
        this.mPointLight.setZPos(5);
        this.mPointLight.setNear(15);
        this.mPointLight.setFar(20);
        this.mPointLight.setIntensity(1);
        this.mPointLight.setLightCastShadowTo(true);

        this.mSpotLight = new Light();
        this.mSpotLight.setLightType(eLightType.eSpotLight);
        this.mSpotLight.setColor([1,1,1,1]);
        this.mSpotLight.setXPos(10);
        this.mSpotLight.setYPos(20);
        this.mSpotLight.setZPos(5);
        this.mSpotLight.setDirection([30,70,-1]);
        this.mSpotLight.setInner(0.5);
        this.mSpotLight.setOuter(1);
        this.mSpotLight.setNear(70);
        this.mSpotLight.setFar(80);
        this.mSpotLight.setDropOff(1);
        this.mSpotLight.setIntensity(2);
        this.mSpotLight.setLightCastShadowTo(true);

        this.mDirectionLight = new Light();
        this.mDirectionLight.setLightType(eLightType.eDirectionalLight);
        this.mDirectionLight.setIntensity(0.1);
        this.mDirectionLight.setZPos(4);
        this.mDirectionLight.setLightCastShadowTo(false);

        // associate the lights with the renderables
        this.mMinionObj.getRenderable().addLight(this.mPointLight);
        this.mMinionObj.getRenderable().addLight(this.mSpotLight);
        this.mBgObj.getRenderable().addLight(this.mPointLight);
        this.mBgObj.getRenderable().addLight(this.mSpotLight);
        this.mBgObj.getRenderable().addLight(this.mDirectionLight);
        this.mRockObj.getRenderable().addLight(this.mPointLight);
        this.mRockObj.getRenderable().addLight(this.mSpotLight);
      
       
       
        // setup the shadow relationships
        this.mShadow = new ShadowReceiver(this.mBgObj);
        this.mShadow.addShadowCaster(this.mMinionObj);
        this.mShadow.addShadowCaster(this.mRockObj);

        engine.defaultResources.setGlobalAmbientIntensity(0.5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.mCamera.setViewAndCameraMatrix();
      
        this.mShadow.draw(this.mCamera);
        this.mMinionObj.draw(this.mCamera);
        this.mRockObj.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // Move left
        if(engine.input.isKeyPressed(engine.input.keys.A)){
            this.mMinionObj.getXform().incXPosBy(-0.5);
            this.mMinionObj.getRenderable().setElementPixelPositions(130,310,0,180)
        }
        // Move right
        if(engine.input.isKeyPressed(engine.input.keys.D)){
            this.mMinionObj.getXform().incXPosBy(0.5);
            this.mMinionObj.getRenderable().setElementPixelPositions(720,900,0,180)
        }
        // Move down
        if(engine.input.isKeyPressed(engine.input.keys.S)){
            this.mMinionObj.getXform().incYPosBy(-0.5);
        }
        // Move Up
        if(engine.input.isKeyPressed(engine.input.keys.W)){
            this.mMinionObj.getXform().incYPosBy(0.5);
        }

        // Move light left
        if(engine.input.isKeyPressed(engine.input.keys.Left)){
            this.mPointLight.setXPos(this.mPointLight.getPosition()[0]-0.5);
        }
        // Move light right
        if(engine.input.isKeyPressed(engine.input.keys.Right)){
            this.mPointLight.setXPos(this.mPointLight.getPosition()[0]+0.5);
        }
        // Move light down
        if(engine.input.isKeyPressed(engine.input.keys.Down)){
            this.mPointLight.setYPos(this.mPointLight.getPosition()[1]-0.5);
        }
        // Move light Up
        if(engine.input.isKeyPressed(engine.input.keys.Up)){
            this.mPointLight.setYPos(this.mPointLight.getPosition()[1]+0.5);
        }

        // quit
        if(engine.input.isKeyClicked(engine.input.keys.Q)){
            this.next();
        }
        this.mRockObj.getRenderable().updateAnimation();
    }

    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene6a();
    myGame.start();
}