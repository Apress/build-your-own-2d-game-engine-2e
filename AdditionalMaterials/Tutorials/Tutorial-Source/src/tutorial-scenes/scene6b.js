
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import ParallaxGameObject from "../engine/game_objects/parallax_game_object.js";
import LightRenderable from "../engine/renderables/light_renderable.js";
import { eBackground } from "../engine/components/layer.js";

class Scene6b extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mBgL1 = null;
	    this.mBgL2 = null;
	    this.mBgL3 = null;
	    this.mBgL4 = null;
	    this.mBgL5 = null;
	    this.mBgL6 = null;
	    this.mBgL7 = null;
	    this.mBgL8 = null;
        this.mMinionObj = null;

        
        this.kTexture = "assets/minion_spritesheet.png";
        this.kLayer1 = "assets/layer_01.png";
	    this.kLayer2 = "assets/layer_02.png";
	    this.kLayer3 = "assets/layer_03.png";
	    this.kLayer4 = "assets/layer_04.png";
	    this.kLayer5 = "assets/layer_05.png";
	    this.kLayer6 = "assets/layer_06.png";
	    this.kLayer7 = "assets/layer_07.png";
	    this.kLayer8 = "assets/layer_08.png";
    }

    load() {
        engine.texture.load(this.kTexture);
        engine.texture.load(this.kLayer1);
        engine.texture.load(this.kLayer2);
        engine.texture.load(this.kLayer3);
        engine.texture.load(this.kLayer4);
        engine.texture.load(this.kLayer5);
        engine.texture.load(this.kLayer6);
        engine.texture.load(this.kLayer7);
        engine.texture.load(this.kLayer8);
    }

    unload() {
        engine.texture.unload(this.kTexture);
        engine.texture.unload(this.kLayer1);
        engine.texture.unload(this.kLayer2);
        engine.texture.unload(this.kLayer3);
        engine.texture.unload(this.kLayer4);
        engine.texture.unload(this.kLayer5);
        engine.texture.unload(this.kLayer6);
        engine.texture.unload(this.kLayer7);
        engine.texture.unload(this.kLayer8);
    }

    init() {
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mMinionObj = new GameObject(new LightRenderable(this.kTexture));
        this.mMinionObj.getRenderable().setElementPixelPositions(130,310,0,180);
        this.mMinionObj.getXform().setSize(20,20);
        this.mMinionObj.getXform().setPosition(50,50);

        this.mBgL1 = new ParallaxGameObject(new LightRenderable(this.kLayer1),1,this.mCamera);
        this.mBgL1.getXform().setSize(200,100);
        this.mBgL1.getXform().setPosition(50,50);
       
        this.mBgL2 = new ParallaxGameObject(new LightRenderable(this.kLayer2),2,this.mCamera);
        this.mBgL2.getXform().setSize(200,100);
        this.mBgL2.getXform().setPosition(50,50);
       
        this.mBgL3 = new ParallaxGameObject(new LightRenderable(this.kLayer3),3,this.mCamera);
        this.mBgL3.getXform().setSize(200,100);
        this.mBgL3.getXform().setPosition(50,50);
       
        this.mBgL4 = new ParallaxGameObject(new LightRenderable(this.kLayer4),4,this.mCamera);
        this.mBgL4.getXform().setSize(200,100);
        this.mBgL4.getXform().setPosition(50,50);
        
        this.mBgL5 = new ParallaxGameObject(new LightRenderable(this.kLayer5),5,this.mCamera);
        this.mBgL5.getXform().setSize(200,100);
        this.mBgL5.getXform().setPosition(50,50);
        
        this.mBgL6 = new ParallaxGameObject(new LightRenderable(this.kLayer6),6,this.mCamera);
        this.mBgL6.getXform().setSize(200,100);
        this.mBgL6.getXform().setPosition(50,50);
       
        this.mBgL7 = new ParallaxGameObject(new LightRenderable(this.kLayer7),7,this.mCamera);
        this.mBgL7.getXform().setSize(200,100);
        this.mBgL7.getXform().setPosition(100,50);
       
        this.mBgL8 = new ParallaxGameObject(new LightRenderable(this.kLayer8),8,this.mCamera);
        this.mBgL8.getXform().setSize(200,100);
        this.mBgL8.getXform().setPosition(50,50);

        // add all of the ParallaxOjbects to the background layer manager
        engine.layer.addToLayer(eBackground,this.mBgL8);
        engine.layer.addToLayer(eBackground,this.mBgL7);
        engine.layer.addToLayer(eBackground,this.mBgL6);
        engine.layer.addToLayer(eBackground,this.mBgL5);
        engine.layer.addToLayer(eBackground,this.mBgL4);
        engine.layer.addToLayer(eBackground,this.mBgL3);
        engine.layer.addToLayer(eBackground,this.mBgL2);
        engine.layer.addToLayer(eBackground,this.mBgL1);
       
        engine.defaultResources.setGlobalAmbientIntensity(3);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.mCamera.setViewAndCameraMatrix();

        engine.layer.drawLayer(eBackground,this.mCamera);
        this.mMinionObj.draw(this.mCamera);
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
        this.mCamera.panWith(this.mMinionObj.getXform(),0.2);

        // quit
        if(engine.input.isKeyClicked(engine.input.keys.Q)){
            this.next();
        }
        this.mCamera.update();
        engine.layer.updateLayer(eBackground);
    }

    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene6b();
    myGame.start();
}