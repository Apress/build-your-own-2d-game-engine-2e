/* File: arena.js 
 *
 */
"use strict";

import engine from "../../engine/index.js";

import * as asset from "../object_textures.js";

import Minion from "./minion.js";

class Arena {
    constructor(x, y, w, h, res, frct, s1, s2, art, p) {
        this.mShapes = new engine.GameObjectSet();
        this.mWalls = new engine.GameObjectSet();
        // this.mPset = new ParticleGameObjectSet();
        this.createBounds(x, y, w, h, res, frct, art);
        this.firstObject = this.mShapes.size();
        this.currentObject = this.firstObject;
        this.createObj(x + 15, y + 20, s1, s2);
        this.rep = p;
        this.pos = [x, y];
    }

    draw(aCamera) {
        this.mShapes.draw(aCamera);
        this.mWalls.draw(aCamera);
    }

    update() {
        this.mShapes.update();
        this.mWalls.update();
        engine.physics.processSet(this.mShapes, null);
        engine.physics.processSetToSet(this.mWalls, this.mShapes, null);
    }

    createObj(x, y, s1, s2) {
        let tmp = s1;
        for (let i = 0; i < 2; i++) {
            if (tmp === 0) {
                this.createBouncy(x, y, 2);
            }
            else if (tmp === 1) {
                this.createBall(x, y, 4);
            }
            else if (tmp === 2) {
                this.createRock(x, y, 5);
            }
            else if (tmp === 3) {
                this.createWood(x, y, 4);
            }
            else if (tmp === 4) {
                this.createIce(x, y, 5);
            }
            else {
                this.createBowlingBall(x, y, 3);
            }
            tmp = s2;
            x += 10;
        }
    }

    createBounds(x, y, w, h, res, frct, art) {
        this.platformAt((x + 3) + (w / 2), y + 3, w + 3, 0, res, frct, art);
        this.platformAt((x + 3) + (w / 2), y + 3 + h, w + 3, 0, res, frct, art);
        this.platformAt(x + 3, (y + 3) + (h / 2), h + 3, 90, res, frct, art);
        this.platformAt(x + 3 + w, (y + 3) + (h / 2), h + 3, 90, res, frct, art);
    }

    incRestitution(inc) {
        let res = this.mWalls.getObjectAt(0).getRigidBody().getRestitution();
        for (let i = 0; i < 4; i++) {
            if (res + inc > 1) {
                this.mWalls.getObjectAt(i).getRigidBody().setRestitution(1);
            }
            else if (res + inc < 0) {
                this.mWalls.getObjectAt(i).getRigidBody().setRestitution(0);
            }
            else {
                this.mWalls.getObjectAt(i).getRigidBody().setRestitution(res + inc);
            }
        }
    }

    incFriction(inc) {
        let frct = this.mWalls.getObjectAt(0).getRigidBody().getFriction();
        for (let i = 0; i < 4; i++) {
            if (frct + inc < 0) {
                this.mWalls.getObjectAt(i).getRigidBody().setFriction(0);
            }
            else {
                this.mWalls.getObjectAt(i).getRigidBody().setFriction(frct + inc);
            }
        }
    }

    randomizeVelocity() {
        let kSpeed = 40;
        let i = 0;
        for (i = 0; i < this.mShapes.size(); i++) {
            let obj = this.mShapes.getObjectAt(i);
            let rigidShape = obj.getRigidBody();
            let x = (Math.random() - 0.5) * kSpeed;
            let y = .6 * kSpeed * 0.5 + 2;
            rigidShape.setVelocity(x, y);
        }
    }
    lightOn() {
        for (let i = 0; i < 4; i++) {
            this.mWalls.getObjectAt(i).getRenderable().setColor([1, 1, 1, .6]);
        }
    }

    lightOff() {
        for (let i = 0; i < 4; i++) {
            this.mWalls.getObjectAt(i).getRenderable().setColor([1, 1, 1, 0]);
        }
    }

    cycleBackward() {
        this.currentObject -= 1;
        if (this.currentObject < 0)
            this.currentObject = this.mShapes.size() - 1;
    }
    cycleFoward() {
        this.currentObject += 1;
        if (this.currentObject >= this.mShapes.size())
            this.currentObject = 0;
    }
    getObject() {
        return this.mShapes.getObjectAt(this.currentObject);
    }

    wallAt(x, y, h, res, frct, art) {
        let w = 3;
        let p = new TextureRenderable(art);
        let xf = p.getXform();
        xf.setSize(w, h);
        xf.setPosition(x, y);
        let g = new GameObject(p);
        let r = new RigidRectangle(xf, w, h);
        g.setRigidBody(r);
        g.toggleDrawRigidShape();

        r.setMass(0);
        r.setRestitution(res);
        r.setFriction(frct);
        xf.setSize(w, h);
        xf.setPosition(x, y);
        this.mWalls.addToSet(g);
    }

    platformAt(x, y, w, rot, res, frct, art) {
        let h = 3;
        let p = new engine.TextureRenderable(art);
        let xf = p.getXform();
        xf.setSize(w, h);
        xf.setPosition(x, y);
        let g = new engine.GameObject(p);
        let r = new engine.RigidRectangle(xf, w, h);
        g.setRigidBody(r);
        g.toggleDrawRigidShape();

        r.setMass(0);
        r.setRestitution(res);
        r.setFriction(frct);
        xf.setSize(w, h);
        xf.setPosition(x, y);
        xf.setRotationInDegree(rot);
        this.mWalls.addToSet(g);
    }

    createBouncy(x, y, size) {
        let m = new Minion(asset.kBouncy, x, y, 1, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setRestitution(.9);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    createBall(x, y, size) {
        let m = new Minion(asset.kBall, x, y, 1, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setRestitution(.7);
        m.getRigidBody().setFriction(.6);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    createIce(x, y, size) {
        let m = new Minion(asset.kIce, x, y, 0, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setRestitution(.4);
        m.getRigidBody().setFriction(.01);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    createRock(x, y, size) {
        let m = new Minion(asset.kRock, x, y, 0, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setMass(20);
        m.getRigidBody().setRestitution(.4);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    createWood(x, y, size) {
        let m = new Minion(asset.kWoodBall, x, y, 1, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setMass(5);
        m.getRigidBody().setRestitution(.5);
        m.getRigidBody().setFriction(.5);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    createBowlingBall = function (x, y, size) {
        let m = new Minion(asset.kBowlingBall, x, y, 1, size);
        this.mShapes.addToSet(m);
        m.getRigidBody().setRestitution(.3);
        m.getRigidBody().setFriction(.2);
        m.getRigidBody().setMass(10);
        m.toggleDrawRenderable();
        m.toggleDrawRigidShape();
    }

    physicsReport() {
        let num1 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getInvMass();
        if (num1 !== 0) {
            num1 = 1 / num1;
        }
        let num2 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getRestitution();
        let num3 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getFriction();
        document.getElementById("value11").innerHTML = +num1.toFixed(2);
        document.getElementById("value12").innerHTML = +num2.toFixed(2);
        document.getElementById("value13").innerHTML = +num3.toFixed(2);
    }

    getCurrentState() {
        let num2 = this.mWalls.getObjectAt(0).getRigidBody().getRestitution();
        let num3 = this.mWalls.getObjectAt(0).getRigidBody().getFriction();
        return "Arena Physics Values: Friction=" + num3.toFixed(2) +
            " Restitution=" + num2.toFixed(2);
    }
    getPos() {
        return this.pos;
    }
}
export default Arena;