/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

"use strict";
import engine from "../../engine/index.js";

let eHeroState = Object.freeze({
    eFaceRight: 0,
    eFaceLeft: 1,
    eRunRight: 2,
    eRunLeft: 3,
    eJumpRight: 4,
    eJumpLeft: 5
});

class Hero extends engine.GameObject {
    constructor(spriteTexture, normalMap, atX, atY, lgtSet) {
        super(null);
        this.kDelta = 0.1;
        this.kWidth = 2;
        this.kHeight = 8 / 3;

        if (normalMap !== null) {
            this.mDye = new engine.IllumRenderable(spriteTexture, normalMap);
        } else {
            this.mDye = new engine.LightRenderable(spriteTexture);
        }
        this.mRenderComponent = this.mDye;

        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(atX, atY);
        this.mDye.getXform().setZPos(1);
        this.mDye.getXform().setSize(this.kWidth, this.kHeight);

        this.mHeroState = eHeroState.eRunRight;
        this.mPreviousHeroState = eHeroState.eRunLeft;
        this.mIsMoving = false;
        this.mCanJump = false;

        this.mDye.setAnimationType(engine.eAnimationType.eLeft);
        this.mDye.setAnimationSpeed(2.5);         // show each element for mAnimSpeed updates                               


        this.mDye.addLight(lgtSet.getLightAt(2)); //jeb fix
        //this.mDye.addLight(lgtSet.getLightAt(3));
        //    this.mDye.addLight(lgtSet.getLightAt(2));

        let jxf = new engine.Transform();
        jxf.setPosition(this.mDye.getXform().getXPos(), this.mDye.getXform().getYPos() - this.kHeight / 2);
        this.mJumpBox = new engine.RigidRectangle(jxf, this.kWidth, 0.25);
        this.mJumpBox.toggleDrawBound();
        //this.setRigidBody(this.mJumpBox);

        let r = new engine.RigidRectangle(this.getXform(), this.kWidth / 1.9, this.kHeight / 1.1);
        r.setMass(0.7);
        r.setRestitution(0);
        r.setInertia(0);
        r.toggleDrawBound();
        r.setAcceleration(0, -30);
        this.setRigidBody(r);
    }

    update() {
        super.update();

        this.mJumpBox.setPosition(this.mDye.getXform().getXPos(), this.mDye.getXform().getYPos() - this.kHeight / 2);

        // control by WASD
        let xform = this.getXform();
        this.mIsMoving = false;
        let v = this.getRigidBody().getVelocity();

        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            if (this.mCanJump === true) {
                this.mPreviousHeroState = this.mHeroState;
                this.mHeroState = eHeroState.eRunLeft;
                this.mIsMoving = true;
            }

            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            if (this.mCanJump === true) {
                this.mPreviousHeroState = this.mHeroState;
                this.mHeroState = eHeroState.eRunRight;
                this.mIsMoving = true;
            }

            xform.incXPosBy(this.kDelta);
        }


        if (this.mCanJump === true) {
            if (this.mIsMoving === false) {
                this.mPreviousHeroState = this.mHeroState;
                if (this.mHeroState === eHeroState.eRunRight || this.mHeroState === eHeroState.eJumpRight)
                    this.mHeroState = eHeroState.eFaceRight;
                if (this.mHeroState === eHeroState.eRunLeft || this.mHeroState === eHeroState.eJumpLeft)
                    this.mHeroState = eHeroState.eFaceLeft;
            }

            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                v[1] = 20; // Jump velocity
                this.mPreviousHeroState = this.mHeroState;
                if (this.mHeroState === eHeroState.eRunRight
                    || this.mHeroState === eHeroState.eFaceRight)
                    this.mHeroState = eHeroState.eJumpRight;
                if (this.mHeroState === eHeroState.eRunLeft
                    || this.mHeroState === eHeroState.eFaceLeft)
                    this.mHeroState = eHeroState.eJumpLeft;
                this.mIsMoving = true;
            }
        }

        this.changeAnimation();
        this.mDye.updateAnimation();
        this.mIsMoving = false;
        this.mCanJump = false;

    }

    changeAnimation() {
        if (this.mHeroState !== this.mPreviousHeroState) {
            switch (this.mHeroState) {
                case eHeroState.eFaceLeft:
                    this.mDye.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(20);
                    break;
                case eHeroState.eFaceRight:
                    this.mDye.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(20);
                    break;
                case eHeroState.eRunLeft:
                    this.mDye.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(5);
                    break;
                case eHeroState.eRunRight:
                    this.mDye.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(5);
                    break;
                case eHeroState.eJumpLeft:
                    this.mDye.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(4);
                    break;
                case eHeroState.eJumpRight:
                    this.mDye.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(4);
                    break;
            }
        }
    }

    draw(aCamera) {
        super.draw(aCamera);
        this.mJumpBox.draw(aCamera);
    }

    canJump(b) {
        this.mCanJump = b;
    }

    getJumpBox() {
        return this.mJumpBox;
    }
}

export default Hero;