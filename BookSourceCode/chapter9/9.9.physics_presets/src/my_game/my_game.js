/*
 * File: RigidShapeDemo.js 
 * This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

import * as asset from "./object_textures.js";
import Arena from "./objects/arena.js";


class MyGame extends engine.Scene {
    constructor() {
        super();

        // The camera to view the scene
        this.mCamera = null;

        this.mArenaStatus = null;
        this.mLabels = null;

        this.world = null;

        this.mCurrentObj = 0;
        this.mTarget = null;
    }

    load() {
        engine.texture.load(asset.kTargetTexture);
        engine.texture.load(asset.kWood);
        engine.texture.load(asset.kDirt);
        engine.texture.load(asset.kIce);
        engine.texture.load(asset.kMud);
        engine.texture.load(asset.kRock);
        engine.texture.load(asset.kBouncy);
        engine.texture.load(asset.kBall);
        engine.texture.load(asset.kWoodBall);
        engine.texture.load(asset.kBowlingBall);
        document.getElementById("physics").style.display = "block";
    }

    unload() {
        engine.texture.unload(asset.kTargetTexture);
        engine.texture.unload(asset.kWood);
        engine.texture.unload(asset.kDirt);
        engine.texture.unload(asset.kIce);
        engine.texture.unload(asset.kMud);
        engine.texture.unload(asset.kRock);
        engine.texture.unload(asset.kBouncy);
        engine.texture.unload(asset.kBall);
        engine.texture.unload(asset.kWoodBall);
        engine.texture.unload(asset.kBowlingBall);
        document.getElementById("physics").style.display = "none";
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
        this.world = new engine.GameObjectSet();
        let m;
        m = new Arena(-1.5, 0, 47, 47 * .75, .6, .01, 1, 2, asset.kIce, false);
        this.world.addToSet(m);
        m = new Arena(48.5, 38.5, 47, 47 * .75, .01, .1, 0, 5, asset.kMud, true);
        this.world.addToSet(m);
        m = new Arena(-1.5, 38.5, 47, 47 * .75, .8, .5, 0, 2, asset.kWood, false);
        this.world.addToSet(m);
        m = new Arena(48.5, 0, 47, 47 * .75, .3, .7, 3, 4, asset.kDirt, false);
        this.world.addToSet(m);

        //this.createBounds();
        let r = new engine.TextureRenderable(asset.kTargetTexture);
        this.mTarget = new engine.GameObject(r);
        let xf = r.getXform();
        xf.setSize(3, 3);

        this.mFirstObject = 0;
        this.mCurrentObj = this.mFirstObject;

        this.mLabels = new engine.GameObjectSet();
        m = new engine.FontRenderable("Ice");
        m.setColor([1, 1, 1, 1]);
        m.getXform().setPosition(20, 39);
        m.setTextHeight(2.5);
        this.mLabels.addToSet(m);

        m = new engine.FontRenderable("Wood");
        m.setColor([1, 1, 1, 1]);
        m.getXform().setPosition(20, 77);
        m.setTextHeight(2.5);
        this.mLabels.addToSet(m);

        m = new engine.FontRenderable("Dirt");
        m.setColor([1, 1, 1, 1]);
        m.getXform().setPosition(70, 39);
        m.setTextHeight(2.5);
        this.mLabels.addToSet(m);

        m = new engine.FontRenderable("Mud");
        m.setColor([1, 1, 1, 1]);
        m.getXform().setPosition(70, 77);
        m.setTextHeight(2.5);
        this.mLabels.addToSet(m);

        this.mArenaStatus = new engine.FontRenderable("");
        this.mArenaStatus.setColor([0, 0, 0, 1]);
        this.mArenaStatus.getXform().setPosition(5, 42);
        this.mArenaStatus.setTextHeight(2.5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();

        //this.mAllObjs.draw(this.mCamera);

        // for now draw these ...
        /*for (let i = 0; i<this.mCollisionInfos.length; i++) 
            this.mCollisionInfos[i].draw(this.mCamera); */
        this.mCollisionInfos = [];

        this.world.draw(this.mCamera);
        this.mTarget.draw(this.mCamera);
        this.mArenaStatus.draw(this.mCamera);
        this.mLabels.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let area = this.world.getObjectAt(this.mCurrentObj);
        let pos = area.getPos();

        if (engine.input.isKeyClicked(engine.input.keys.Left)) {
            area.cycleFoward();
        }
        if (engine.input.isKeyClicked(engine.input.keys.Right)) {
            area.cycleBackward();
        }

        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            area.incRestitution(-.01);
        }
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            area.incRestitution(.01);
        }
        if (engine.input.isKeyPressed(engine.input.keys.R)) {
            area.incFriction(-.01);
        }
        if (engine.input.isKeyPressed(engine.input.keys.T)) {
            area.incFriction(.01);
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            area.randomizeVelocity();
        }

        if (engine.input.isKeyClicked(engine.input.keys.U)) {
            area.createBouncy(pos[0] + 15, pos[1] + 20, 2);
        }
        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            area.createBall(pos[0] + 15, pos[1] + 20, 4);
        }
        if (engine.input.isKeyClicked(engine.input.keys.I)) {
            area.createRock(pos[0] + 15, pos[1] + 20, 5);
        }

        if (engine.input.isKeyClicked(engine.input.keys.K)) {
            area.createWood(pos[0] + 15, pos[1] + 20, 4);
        }
        if (engine.input.isKeyClicked(engine.input.keys.O)) {
            area.createIce(pos[0] + 15, pos[1] + 20, 5);
        }

        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            area.createBowlingBall(pos[0] + 15, pos[1] + 20, 3);
        }

        if (engine.input.isKeyClicked(engine.input.keys.Z)) {
            area.lightOff();
            this.mCurrentObj -= 1;
            if (this.mCurrentObj < this.mFirstObject)
                this.mCurrentObj = this.world.size() - 1;
        }
        if (engine.input.isKeyClicked(engine.input.keys.X)) {
            area.lightOff();
            this.mCurrentObj += 1;
            if (this.mCurrentObj >= this.world.size())
                this.mCurrentObj = this.mFirstObject;
        }
        this.world.getObjectAt(this.mCurrentObj).lightOn();
        this.world.update();
        let obj = area.getObject();
        area.physicsReport();
        obj.keyControl();

        let p = obj.getXform().getPosition();
        this.mTarget.getXform().setPosition(p[0], p[1]);
        this.mArenaStatus.setText(area.getCurrentState());
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}