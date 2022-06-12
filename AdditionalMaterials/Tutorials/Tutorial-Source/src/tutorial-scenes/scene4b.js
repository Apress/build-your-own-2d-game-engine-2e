
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import GameObject from "../engine/game_objects/game_object.js";
import engine from "../engine/index.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import RigidRectangle from "../engine/rigid_shapes/rigid_rectangle_main.js";
import ParticleSet from "../engine/particles/particle_set.js";
import Particle from "../engine/particles/particle.js";

class Scene4b extends engine.Scene {
    constructor() {
        super();
        this.mCamera = null;
        this.mMinionObj = null;
        this.mPlatformObj = null;
      
        this.kTexture = "assets/minion_spritesheet.png";
        this.kPlatform = "assets/platform.png";
        this.kParticle = "assets/particle.png";

        this.mAllParticles = new ParticleSet();
    }

    load() {
        engine.texture.load(this.kTexture);
        engine.texture.load(this.kPlatform);
        engine.texture.load(this.kParticle);
    }

    unload() {
        engine.texture.unload(this.kTexture);
        engine.texture.unload(this.kPlatform);
        engine.texture.unload(this.kParticle);
    }

    init() {
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 600, 600],         // viewport (orgX, orgY, width, height)
            2
        );
        this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

        this.mMinionObj = new GameObject(new SpriteRenderable(this.kTexture));
        this.mMinionObj.getRenderable().setElementPixelPositions(130,310,0,180);
        this.mMinionObj.getXform().setSize(20,20);
        this.mMinionObj.getXform().setPosition(50,70);

        this.mPlatformObj = new GameObject(new TextureRenderable(this.kPlatform));
        this.mPlatformObj.getXform().setSize(40,10);
        this.mPlatformObj.getXform().setPosition(50,40);

        engine.physics.setSystemAcceleration(0,0);

        let r1 = new RigidRectangle(this.mMinionObj.getXform(),14,19);
        this.mMinionObj.setRigidBody(r1);

        let r2 = new RigidRectangle(this.mPlatformObj.getXform(),40,9);
        r2.setMass(0);
        this.mPlatformObj.setRigidBody(r2);
        
        engine.defaultResources.setGlobalAmbientIntensity(4);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.mCamera.setViewAndCameraMatrix();

        this.mMinionObj.draw(this.mCamera);
        this.mPlatformObj.draw(this.mCamera);
        this.mAllParticles.draw(this.mCamera);
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

        // Toggle bound drawing
        if(engine.input.isKeyClicked(engine.input.keys.C)){
            this.mMinionObj.toggleDrawRigidShape();
            this.mPlatformObj.toggleDrawRigidShape();
        }

        // Create a ParticleEmitter
        if(engine.input.isKeyPressed(engine.input.keys.Z)){
            let x = this.mCamera.mouseWCX();
            let y = this.mCamera.mouseWCY();
            this.mAllParticles.addEmitterAt(x,y,50,this._createParticle);
        }
        if(engine.input.isKeyClicked(engine.input.keys.Q)){
            this.next();
        }
       
        this.mAllParticles.update();
        engine.physics.collideShape(this.mMinionObj.getRigidBody(),this.mPlatformObj.getRigidBody());
        engine.particleSystem.resolveRigidShapeCollision(this.mMinionObj,this.mAllParticles);
        engine.particleSystem.resolveRigidShapeCollision(this.mPlatformObj,this.mAllParticles);
        
        this.mMinionObj.update();
        this.mPlatformObj.update();
    }
    _createParticle(X,Y){
        
        let life = 30 + Math.random() * 300;
	    let p = new Particle("assets/particle.png", X, Y, life);
       
	    p.setColor([1, 0, 0, 1]);
    
	    // size of the particle
	    var r = 5.5 + Math.random() * 0.5;
	    p.setSize(r, r);
    
	    // final color
	    var fr = 3.5 + Math.random();
	    var fg = 0.4 + 0.1 * Math.random();
	    var fb = 0.3 + 0.1 * Math.random();
	    p.setFinalColor([fr, fg, fb, 0.6]);
    
	    // velocity on the particle
	    var fx = 10 - 20 * Math.random();
	    var fy = 10 * Math.random();
	    p.setVelocity(fx, fy);
    
	    // size delta
	    p.setSizeDelta(0.98);
    
	    return p;
    }

    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Scene4b();
    myGame.start();
}