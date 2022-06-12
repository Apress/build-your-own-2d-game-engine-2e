
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import SpriteAnimateRenderable, { eAnimationType } from "../engine/renderables/sprite_animate_renderable.js";
import LightRenderable from "../engine/renderables/light_renderable.js";
import Light, { eLightType } from "../engine/lights/light.js";
import IllumRenderable from "../engine/renderables/illum_renderable.js";

class Scene5b extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mMinionObj = null;
        this.mBackground = null;
        this.mPointLight = null;
        this.mRockObj = null;
        this.mSpotLight = null;
        this.mDirectionLight = null;
      
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
        this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

        this.mBackground = new IllumRenderable(this.kBackground,this.kBackgroundNormal);
        this.mBackground.getXform().setSize(100,100);
        this.mBackground.getXform().setPosition(50,50);

        this.mMinionObj = new GameObject(new LightRenderable(this.kTexture));
        this.mMinionObj.getRenderable().setElementPixelPositions(130,310,0,180);
        this.mMinionObj.getXform().setSize(20,20);
        this.mMinionObj.getXform().setPosition(50,50);

        this.mRockObj = new GameObject(new IllumRenderable(this.kRockTexture,this.kRockNormal));
        this.mRockObj.getRenderable().setSpriteSequence(64,0,61,64,59,2);
        this.mRockObj.getRenderable().setAnimationSpeed(2);
        this.mRockObj.getRenderable().setAnimationType(eAnimationType.eRight);
        this.mRockObj.getXform().setSize(10,10);
        this.mRockObj.getXform().setPosition(30,70);

        // create the light and set properties
        this.mPointLight = new Light();
        this.mPointLight.setLightType(eLightType.ePointLight);
        this.mPointLight.setColor([1,1,1,1]);
        this.mPointLight.setXPos(50);
        this.mPointLight.setYPos(50);
        this.mPointLight.setZPos(1);
        this.mPointLight.setNear(10);
        this.mPointLight.setFar(14);
        this.mPointLight.setIntensity(1);

        this.mSpotLight = new Light();
        this.mSpotLight.setLightType(eLightType.eSpotLight);
        this.mSpotLight.setColor([1,1,1,1]);
        this.mSpotLight.setXPos(10);
        this.mSpotLight.setYPos(20);
        this.mSpotLight.setZPos(1);
        this.mSpotLight.setDirection([30,70,-1]);
        this.mSpotLight.setInner(0.5);
        this.mSpotLight.setOuter(1);
        this.mSpotLight.setNear(70);
        this.mSpotLight.setFar(80);
        this.mSpotLight.setDropOff(1);
        this.mSpotLight.setIntensity(2);

        this.mDirectionLight = new Light();
        this.mDirectionLight.setLightType(eLightType.eDirectionalLight);
        this.mDirectionLight.setIntensity(0.1);

        // associate the light with the renderables
        this.mMinionObj.getRenderable().addLight(this.mPointLight);
        this.mMinionObj.getRenderable().addLight(this.mSpotLight);
        this.mMinionObj.getRenderable().addLight(this.mDirectionLight);
        this.mBackground.addLight(this.mPointLight);
        this.mBackground.addLight(this.mSpotLight);
        this.mBackground.addLight(this.mDirectionLight);
        this.mRockObj.getRenderable().addLight(this.mPointLight);
        this.mRockObj.getRenderable().addLight(this.mSpotLight);
        this.mRockObj.getRenderable().addLight(this.mDirectionLight);

        engine.defaultResources.setGlobalAmbientIntensity(0.5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.mCamera.setViewAndCameraMatrix();

        this.mBackground.draw(this.mCamera);
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

    let myGame = new Scene5b();
    myGame.start();
}