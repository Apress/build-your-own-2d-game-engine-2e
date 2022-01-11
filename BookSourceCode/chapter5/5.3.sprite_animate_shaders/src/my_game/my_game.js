/* File: MyGame.js
 *
 * This is game developer's game
 * 
 */
"use strict";

// Engine stuff
import engine from "../engine/index.js";

class MyGame extends engine.Scene {

    constructor() {
        super();
        // textures: 
        this.kFontImage = "assets/consolas-72.png";
        this.kMinionSprite = "assets/minion_sprite.png";  // Portal and Collector are embedded here

        // The camera to view the scene
        this.mCamera = null;

        // the hero and the support objects
        this.mHero = null;
        this.mPortal = null;
        this.mCollector = null;
        this.mFontImage = null;
        this.mRightMinion = null;
        this.mLeftMinion = null;
    }

    load() {
        // loads the textures
        engine.texture.load(this.kFontImage);
        engine.texture.load(this.kMinionSprite);
    }

    unload() {
        engine.texture.unload(this.kFontImage);
        engine.texture.unload(this.kMinionSprite);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Step B: Create the support objects
        this.mPortal = new engine.SpriteRenderable(this.kMinionSprite);
        this.mPortal.setColor([1, 0, 0, 0.2]);  // tints red
        this.mPortal.getXform().setPosition(25, 60);
        this.mPortal.getXform().setSize(3, 3);
        this.mPortal.setElementPixelPositions(130, 310, 0, 180);

        this.mCollector = new engine.SpriteRenderable(this.kMinionSprite);
        this.mCollector.setColor([0, 0, 0, 0]);  // No tinting
        this.mCollector.getXform().setPosition(15, 60);
        this.mCollector.getXform().setSize(3, 3);
        this.mCollector.setElementUVCoordinate(0.308, 0.483, 0, 0.352);

        // Step C: Create the font and minion images using sprite
        this.mFontImage = new engine.SpriteRenderable(this.kFontImage);
        this.mFontImage.setColor([1, 1, 1, 0]);
        this.mFontImage.getXform().setPosition(13, 62);
        this.mFontImage.getXform().setSize(4, 4);

        // The right minion
        this.mRightMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mRightMinion.setColor([1, 1, 1, 0]);
        this.mRightMinion.getXform().setPosition(26, 56.5);
        this.mRightMinion.getXform().setSize(4, 3.2);
        this.mRightMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
        this.mRightMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates

        // the left minion
        this.mLeftMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mLeftMinion.setColor([1, 1, 1, 0]);
        this.mLeftMinion.getXform().setPosition(15, 56.5);
        this.mLeftMinion.getXform().setSize(4, 3.2);
        this.mLeftMinion.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
        this.mLeftMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new engine.SpriteRenderable(this.kMinionSprite);
        this.mHero.setColor([1, 1, 1, 0]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Draw everything
        this.mPortal.draw(this.mCamera);
        this.mCollector.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mFontImage.draw(this.mCamera);
        this.mRightMinion.draw(this.mCamera);
        this.mLeftMinion.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero, 
        let deltaX = 0.05;
        let xform = this.mHero.getXform();

        // Support hero movements
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                xform.setXPos(20);
            }
        }

        // continuously change texture tinting
        let c = this.mPortal.getColor();
        let ca = c[3] + deltaX;
        if (ca > 1) {
            ca = 0;
        }
        c[3] = ca;

        // New update code for changing the sub-texture regions being shown"
        let deltaT = 0.001;

        // The font image:
        // zoom into the texture by updating texture coordinate
        // For font: zoom to the upper left corner by changing bottom right
        let texCoord = this.mFontImage.getElementUVCoordinateArray();
        // The 8 elements:
        //      mTexRight,  mTexTop,          // x,y of top-right
        //      mTexLeft,   mTexTop,
        //      mTexRight,  mTexBottom,
        //      mTexLeft,   mTexBottom
        let b = texCoord[engine.eTexCoordArrayIndex.eBottom] + deltaT;
        let r = texCoord[engine.eTexCoordArrayIndex.eRight] - deltaT;
        if (b > 1.0) {
            b = 0;
        }
        if (r < 0) {
            r = 1.0;
        }
        this.mFontImage.setElementUVCoordinate(
            texCoord[engine.eTexCoordArrayIndex.eLeft],
            r,
            b,
            texCoord[engine.eTexCoordArrayIndex.eTop]
        );
        // 

        // New code for controlling the sprite animation
        // controlling the sprite animation:
        // remember to update the minion's animation
        this.mRightMinion.updateAnimation();
        this.mLeftMinion.updateAnimation();

        // Animate left on the sprite sheet
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.mRightMinion.setAnimationType(engine.eAnimationType.eLeft);
            this.mLeftMinion.setAnimationType(engine.eAnimationType.eLeft);
        }

        // swing animation 
        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            this.mRightMinion.setAnimationType(engine.eAnimationType.eSwing);
            this.mLeftMinion.setAnimationType(engine.eAnimationType.eSwing);
        }

        // Animate right on the sprite sheet
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
            this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
        }

        // decrease the duration of showing each sprite element, thereby speeding up the animation
        if (engine.input.isKeyClicked(engine.input.keys.Four)) {
            this.mRightMinion.incAnimationSpeed(-2);
            this.mLeftMinion.incAnimationSpeed(-2);
        }

        // increase the duration of showing each sprite element, thereby slowing down the animation
        if (engine.input.isKeyClicked(engine.input.keys.Five)) {
            this.mRightMinion.incAnimationSpeed(2);
            this.mLeftMinion.incAnimationSpeed(2);
        }
    }
}

export default MyGame;

window.onload = function() {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}