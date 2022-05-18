"use strict";
import engine from "../../engine/index.js";
import ChaserMinion from "./chaser_minion.js";

const kMinionTex = "assets/minion_sprite.png";
// this.kDelta = 0.1;
const kWidth = 8;
const kHeight = 8;
const kSpeed = 0.02;
const kSpawnerTotal = 800;

class Boss extends engine.GameObject {
    constructor(atX, atY, velocity, movementRange, type, texture0, texture1, texture2,
        texture3, texture4, texture5, texture6, normal, lightSet, hero) {
        super(null);

        this.mSpawnerTicks = 0;
        this.mTicks = 0;
        this.mClockwise = 1;
        this.mLightSet = lightSet;
        this.mHeroRef = hero;
        this.mAllMinions = [];

        // control of movement
        this.mInitialPosition = vec2.fromValues(atX, atY);
        this.mMovementRange = movementRange;

        if (normal === null) {
            this.mDyeBoss_Bottom = new engine.LightRenderable(texture0);
            this.mDyeBoss_Top = new engine.LightRenderable(texture1);
            this.mDyeBoss_CenterSpawn = new engine.LightRenderable(texture2);
            this.mDyeBoss_Eyeballs = new engine.LightRenderable(texture3);
            this.mDyeBoss_Eyeballs02 = new engine.LightRenderable(texture3);
            this.mDyeBoss_WeakPoint_Blue = new engine.LightRenderable(texture4);
            this.mDyeBoss_WeakPoint_Green = new engine.LightRenderable(texture5);
            this.mDyeBoss_WeakPoint_Red = new engine.LightRenderable(texture6);
        } else {
            this.mDyeBoss_Bottom = new engine.IllumRenderable(texture0, normal);
            this.mDyeBoss_Top = new engine.IllumRenderable(texture1, normal);
            this.mDyeBoss_CenterSpawn = new engine.IllumRenderable(texture2, normal);
            this.mDyeBoss_Eyeballs = new engine.IllumRenderable(texture3, normal);
            this.mDyeBoss_Eyeballs02 = new engine.IllumRenderable(texture3, normal);
            this.mDyeBoss_WeakPoint_Blue = new engine.IllumRenderable(texture4, normal);
            this.mDyeBoss_WeakPoint_Green = new engine.IllumRenderable(texture5, normal);
            this.mDyeBoss_WeakPoint_Red = new engine.IllumRenderable(texture6, normal);
        }

        this.light = this._createPointLight(atX, atY);
        lightSet.addToSet(this.light);

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mDyeBoss_Bottom.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_Top.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_CenterSpawn.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_Eyeballs.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_Eyeballs02.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_WeakPoint_Blue.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_WeakPoint_Green.addLight(lightSet.getLightAt(i));
            this.mDyeBoss_WeakPoint_Red.addLight(lightSet.getLightAt(i));
        }

        this.buildSprite(atX, atY);
        this.mRenderComponent = this.mDyeBoss_Bottom;

        let rigidShape = new engine.RigidRectangle(this.getXform(), kWidth, kHeight);
        rigidShape.setMass(0);
        rigidShape.toggleDrawBound();
        rigidShape.setAcceleration(0, 0);
        this.setRigidBody(rigidShape);

        // velocity and movementRange will come later
        let size = vec2.length(velocity);
        if (size > 0.001) {
            this.setCurrentFrontDir(velocity);
            vec2.scale(velocity, velocity, kSpeed);
            rigidShape.setVelocity(velocity[0], velocity[1]);
        }
    }


    update() {
        super.update();
        let p = this.getXform().getPosition();
        vec2.add(p, p, this.getRigidBody().getVelocity());

        let i;
        for (i = 0; i < this.mAllMinions.length; i++) {
            this.mAllMinions[i].update(this.mHeroRef);
        }

        this.mTicks++
        if (this.mTicks > 20) {
            this.mClockwise *= -1;
            this.mTicks = 0;
        }

        this.mSpawnerTicks++;
        if (this.mSpawnerTicks > kSpawnerTotal && this.mAllMinions.length < 6) {
            this._spawnChaser();
            this.mSpawnerTicks = 0;
        }

        let s = vec2.fromValues(0, 0);
        vec2.subtract(s, this.getXform().getPosition(), this.mInitialPosition);
        let len = vec2.length(s);

        if (len > this.mMovementRange) {
            this.getRigidBody().flipVelocity();

        }
        this.light.set2DPosition(this.getXform().getPosition());
        this.buildSprite(this.getXform().getPosition()[0], this.getXform().getPosition()[1] - this.mClockwise * 0.01);

        this.mDyeBoss_WeakPoint_Blue.getXform().incRotationByDegree(1);
        this.mDyeBoss_WeakPoint_Red.getXform().incRotationByDegree(1);
        this.mDyeBoss_WeakPoint_Green.getXform().incRotationByDegree(1);

        this.mDyeBoss_CenterSpawn.getXform().incRotationByDegree(5);

        //    this.mDyeBoss_Eyeballs.getXform().incRotationByDegree(10 * Math.random()* this.mClockwise);
        //    this.mDyeBoss_Eyeballs02.getXform().incRotationByDegree(10 * Math.random() * this.mClockwise);
    }

    buildSprite(atX, atY) {
        this.mDyeBoss_Bottom.getXform().setPosition(atX, atY);
        this.mDyeBoss_Bottom.getXform().setSize(kWidth, kHeight);
        this.mDyeBoss_Bottom.getXform().setZPos(2);

        this.mDyeBoss_Top.getXform().setPosition(atX, atY);
        this.mDyeBoss_Top.getXform().setSize(kWidth, kHeight);
        this.mDyeBoss_Top.getXform().setZPos(2);

        let centerScaler = 1.75;
        this.mDyeBoss_CenterSpawn.getXform().setPosition(atX + 0.525, atY);
        this.mDyeBoss_CenterSpawn.getXform().setSize(kWidth / centerScaler, kHeight / centerScaler);
        this.mDyeBoss_CenterSpawn.getXform().setZPos(2);

        let eyeScaler = 4;
        this.mDyeBoss_Eyeballs.getXform().setPosition(atX - 2.75, atY + 1.25);
        this.mDyeBoss_Eyeballs.getXform().setSize(kWidth / eyeScaler, kHeight / eyeScaler);
        this.mDyeBoss_Eyeballs.getXform().setZPos(2);

        this.mDyeBoss_Eyeballs02.getXform().setPosition(atX - 2.75, atY - 1.25);
        this.mDyeBoss_Eyeballs02.getXform().setSize(kWidth / eyeScaler, kHeight / eyeScaler);
        this.mDyeBoss_Eyeballs02.getXform().setZPos(2);

        let weakspotScaler = 3;
        this.mDyeBoss_WeakPoint_Blue.getXform().setPosition(atX + 0.25, atY + 3);
        this.mDyeBoss_WeakPoint_Blue.getXform().setSize(kWidth / weakspotScaler, kHeight / weakspotScaler);
        this.mDyeBoss_WeakPoint_Blue.getXform().setZPos(2);

        this.mDyeBoss_WeakPoint_Green.getXform().setPosition(atX + 3.5, atY);
        this.mDyeBoss_WeakPoint_Green.getXform().setSize(kWidth / weakspotScaler, kHeight / weakspotScaler);
        this.mDyeBoss_WeakPoint_Green.getXform().setZPos(2);

        this.mDyeBoss_WeakPoint_Red.getXform().setPosition(atX + 0.25, atY - 3);
        this.mDyeBoss_WeakPoint_Red.getXform().setSize(kWidth / weakspotScaler, kHeight / weakspotScaler);
        this.mDyeBoss_WeakPoint_Red.getXform().setZPos(2);
    }

    _createPointLight(atX, atY) {
        let lgt = new engine.Light();
        lgt.setLightType(0);
        lgt.setColor([1, 1, 1, 1]);
        lgt.setXPos(atX);
        lgt.setYPos(atY);
        lgt.setZPos(1);
        lgt.setNear(4);
        lgt.setFar(6);
        lgt.setIntensity(0.5);
        lgt.setDropOff(20);
        lgt.setLightCastShadowTo(true);
        return lgt;
    }

    draw(aCamera) {
        super.draw(aCamera);
        //this.mDyeBoss_Bottom.draw(aCamera);     
        this.mDyeBoss_WeakPoint_Blue.draw(aCamera);
        this.mDyeBoss_WeakPoint_Green.draw(aCamera);
        this.mDyeBoss_WeakPoint_Red.draw(aCamera);

        this.mDyeBoss_Eyeballs.draw(aCamera);
        this.mDyeBoss_Eyeballs02.draw(aCamera);

        this.mDyeBoss_CenterSpawn.draw(aCamera);
        this.mDyeBoss_Top.draw(aCamera);

        let i;
        for (i = 0; i < this.mAllMinions.length; i++) {
            this.mAllMinions[i].draw(aCamera);
        }
    }

    _spawnChaser() {
        let x = this.getXform().getXPos();
        let y = this.getXform().getYPos();
        let m = new ChaserMinion(x, y, [0, 1], 0, 2, kMinionTex, null, this.mLightSet, 1, 1.6);
        this.mAllMinions.push(m);
    }
}

export default Boss;