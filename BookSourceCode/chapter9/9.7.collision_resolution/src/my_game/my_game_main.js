/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatformTexture = "assets/platform.png";
        this.kWallTexture = "assets/wall.png";
        this.kTargetTexture = "assets/target.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;
        this.mShapeMsg = null;

        this.mAllObjs = null;
        this.mPlatforms = null;
        this.mBounds = null;
        this.mCollisionInfos = [];
        this.mHero = null;

        this.mCurrentObj = 0;
        this.mTarget = null;

        // Draw controls
        this.mDrawCollisionInfo = false;
        this.mDrawTexture = false;
        this.mDrawBounds = false;
        this.mDrawRigidShape = true;
    }



    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatformTexture);
        engine.texture.load(this.kWallTexture);
        engine.texture.load(this.kTargetTexture);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatformTexture);
        engine.texture.unload(this.kWallTexture);
        engine.texture.unload(this.kTargetTexture);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 40), // position of the camera
            100,                     // width of camera
            [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        engine.defaultResources.setGlobalAmbientIntensity(3);

        this.mAllObjs = new engine.GameObjectSet();
        this.mPlatforms = new engine.GameObjectSet();

        this.createBounds();  // added to mPlatforms

        this.mHero = new Hero(this.kMinionSprite);
        this.mAllObjs.addToSet(this.mHero);
        this.mCurrentObj = 0;
        
        let y = 70;
        let x = 10;
        for (let i = 1; i <= 5; i++) {
            let m = new Minion(this.kMinionSprite, x, y, ((i % 2) !== 0));
            x += 20;
            this.mAllObjs.addToSet(m);
        }

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(5, 7);
        this.mMsg.setTextHeight(3);

        this.mShapeMsg = new engine.FontRenderable("Shape");
        this.mShapeMsg.setColor([0, 0, 0, 1]);
        this.mShapeMsg.getXform().setPosition(5, 73);
        this.mShapeMsg.setTextHeight(2.5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();

        this.mPlatforms.draw(this.mCamera);
        this.mAllObjs.draw(this.mCamera);

        // for now draw these ...
        if (this.mCollisionInfos !== null) {
        for (let i = 0; i < this.mCollisionInfos.length; i++)
            this.mCollisionInfos[i].draw(this.mCamera);
        this.mCollisionInfos = [];
        }

        this.mTarget.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);   // draw last
        this.mShapeMsg.draw(this.mCamera);
    }

    incShapeSize(obj, delta) {
        let s = obj.getRigidBody();
        let r = s.incShapeSizeBy(delta);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let msg = "";
        let kBoundDelta = 0.1;

        this.mAllObjs.update(this.mCamera);
        this.mPlatforms.update(this.mCamera);

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            engine.physics.togglePositionalCorrection();
        }
        if (engine.input.isKeyClicked(engine.input.keys.V)) {
            engine.physics.toggleHasMotion();
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.randomizeVelocity();
        }

        if (engine.input.isKeyClicked(engine.input.keys.Left)) {
            this.mCurrentObj -= 1;
            if (this.mCurrentObj < 0)
                this.mCurrentObj = this.mAllObjs.size() - 1;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Right)) {
            this.mCurrentObj += 1;
            if (this.mCurrentObj >= this.mAllObjs.size())
                this.mCurrentObj = 0;
        }

        let obj = this.mAllObjs.getObjectAt(this.mCurrentObj);
        if (engine.input.isKeyPressed(engine.input.keys.Y)) {
            this.incShapeSize(obj, kBoundDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.U)) {
            this.incShapeSize(obj, -kBoundDelta);
        }

        if (engine.input.isKeyClicked(engine.input.keys.G)) {
            let x = 50 + Math.random() * 20;
            let y = 50;
            let t = Math.random() > 0.5;
            let m = new Minion(this.kMinionSprite, x, y, t);
            if (this.mDrawTexture) // default is false
                m.toggleDrawRenderable();
            if (this.mDrawBounds) // default is false
                m.getRigidBody().toggleDrawBound();
            if (!this.mDrawRigidShape) // default is true
                m.toggleDrawRigidShape();
            this.mAllObjs.addToSet(m);
        }

        obj.keyControl();
        this.drawControlUpdate();

        if (this.mDrawCollisionInfo)
            this.mCollisionInfos = [];
        else
            this.mCollisionInfos = null;
        engine.physics.processObjToSet(this.mHero, this.mPlatforms, this.mCollisionInfos);
        engine.physics.processSetToSet(this.mAllObjs, this.mPlatforms, this.mCollisionInfos);
        engine.physics.processSet(this.mAllObjs, this.mCollisionInfos);

        let p = obj.getXform().getPosition();
        this.mTarget.getXform().setPosition(p[0], p[1]);
        msg += "  P(" + engine.physics.getPositionalCorrection() +
            " " + engine.physics.getRelaxationCount() + ")" +
            " V(" + engine.physics.getHasMotion() + ")";
        this.mMsg.setText(msg);

        this.mShapeMsg.setText(obj.getRigidBody().getCurrentState());
    }

    drawControlUpdate() {
        let i;
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.mDrawCollisionInfo = !this.mDrawCollisionInfo;
        }
        if (engine.input.isKeyClicked(engine.input.keys.T)) {
            this.mDrawTexture = !this.mDrawTexture;
            this.mAllObjs.toggleDrawRenderable();
            this.mPlatforms.toggleDrawRenderable();
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mDrawRigidShape = !this.mDrawRigidShape;
            this.mAllObjs.toggleDrawRigidShape();
            this.mPlatforms.toggleDrawRigidShape();
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mDrawBounds = !this.mDrawBounds;
            this.mAllObjs.toggleDrawBound();
            this.mPlatforms.toggleDrawBound();
        }
    }
}

export default MyGame;