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
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mTheLight = null;

        this.mBlock1 = null;   // to verify switching between shaders is fine
        this.mBlock2 = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
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
        this.mTheLight = new engine.Light();
        this.mTheLight.setRadius(8);
        this.mTheLight.setZPos(2);
        this.mTheLight.setXPos(30);
        this.mTheLight.setYPos(30);  // Position above LMinion
        this.mTheLight.setColor([0.9, 0.9, 0.2, 1]);

        // the Background
        let bgR = new engine.LightRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(100, 100);
        bgR.getXform().setPosition(50, 35);
        bgR.addLight(this.mTheLight);
        this.mBg = new engine.GameObject(bgR);

        // 
        // the objects
        this.mHero = new Hero(this.kMinionSprite);
        this.mHero.getRenderable().addLight(this.mTheLight);

        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mLMinion.getRenderable().addLight(this.mTheLight);

        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
        // RMinion did not addAdd and thus does not get illuminated by the light!

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
        let msg, i, c;
        let deltaC = 0.01;
        let deltaZ = 0.05;

        this.mCamera.update();  // to ensure proper interpolated movement effects
        this.mLMinion.update(); // ensure sprite animation
        this.mRMinion.update();
        this.mHero.update();  // allow keyboard control to move

        if (engine.input.isButtonPressed(engine.input.eMouseButton.eLeft)) {
            this.mTheLight.set2DPosition(this.mHero.getXform().getPosition());
        }

        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            c = this.mTheLight.getColor();
            for (i = 0; i < 4; i++) {
                c[i] += deltaC;
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            c = this.mTheLight.getColor();
            for (i = 0; i < 4; i++) {
                c[i] -= deltaC;
            }
        }

        let p = this.mTheLight.getPosition(), r;
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            p[2] += deltaZ;
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            p[2] -= deltaZ;
        }
        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            r = this.mTheLight.getRadius();
            r += deltaC;
            this.mTheLight.setRadius(r);
        }
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            r = this.mTheLight.getRadius();
            r -= deltaC;
            this.mTheLight.setRadius(r);
        }

        c = this.mTheLight.getColor();
        msg = "LightColor:" + c[0].toPrecision(4) + " " + c[1].toPrecision(4) +
            " " + c[2].toPrecision(4) + " " + c[3].toPrecision(4) +
            " Z=" + p[2].toPrecision(3) +
            " r=" + this.mTheLight.getRadius().toPrecision(3);
            
        this.mMsg.setText(msg);
    }

}

export default MyGame;