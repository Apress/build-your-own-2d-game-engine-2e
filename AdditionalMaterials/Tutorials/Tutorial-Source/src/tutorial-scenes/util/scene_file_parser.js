/*
 * File: scene_file_parser.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

// local
import Platform from "../objects/platform.js";
import Minion from "../objects/minion.js";
import SentryMinion from "../objects/sentry_minion.js";
import ChaserMinion from "../objects/chaser_minion.js";
import Boss from "../objects/boss.js";
import Wall from "../objects/wall.js";
import Door from "../objects/door.js";
import Button from "../objects/button.js";

class SceneFileParser {
    constructor(sceneFilePath) {
        this.mSceneXml = engine.xml.get(sceneFilePath);
    }

    _convertToNum(a) {
        let j;
        for (j = 0; j < a.length; j++) {
            a[j] = Number(a[j]);
        }
    }

    _getElm(tagElm) {
        let theElm = this.mSceneXml.getElementsByTagName(tagElm);
        if (theElm.length === 0) {
            console.error("Warning: Level element:[" + tagElm + "]: is not found!");
        }
        return theElm;
    }

    parseCamera() {
        let camElm = this._getElm("Camera");
        let cx = Number(camElm[0].getAttribute("CenterX"));
        let cy = Number(camElm[0].getAttribute("CenterY"));
        let w = Number(camElm[0].getAttribute("Width"));
        let viewport = camElm[0].getAttribute("Viewport").split(" ");
        let bgColor = camElm[0].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        this._convertToNum(bgColor);
        this._convertToNum(viewport);

        let cam = new engine.Camera(
            vec2.fromValues(cx, cy), // position of the camera
            w, // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor);
        return cam;
    }


    parseLights() {
        let lightSet = new engine.LightSet();
        let elm = this._getElm("Light");
        let i, type, pos, dir, color, n, f, inner, outer, intensity, dropoff, shadow, lgt;
        for (i = 0; i < elm.length; i++) {
            type = Number(elm.item(i).attributes.getNamedItem("Type").value);
            color = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            pos = elm.item(i).attributes.getNamedItem("Pos").value.split(" ");
            dir = elm.item(i).attributes.getNamedItem("Dir").value.split(" ");
            n = Number(elm.item(i).attributes.getNamedItem("Near").value);
            f = Number(elm.item(i).attributes.getNamedItem("Far").value);
            inner = Number(elm.item(i).attributes.getNamedItem("Inner").value);
            outer = Number(elm.item(i).attributes.getNamedItem("Outter").value);
            dropoff = Number(elm.item(i).attributes.getNamedItem("DropOff").value);
            intensity = Number(elm.item(i).attributes.getNamedItem("Intensity").value);
            shadow = elm.item(i).attributes.getNamedItem("CastShadow").value;
            // make sure array contains numbers
            this._convertToNum(color);
            this._convertToNum(pos);
            this._convertToNum(dir);

            // convert type ...

            lgt = new engine.Light();
            lgt.setLightType(type);
            lgt.setColor(color);
            lgt.setXPos(pos[0]);
            lgt.setYPos(pos[1]);
            lgt.setZPos(pos[2]);
            lgt.setDirection(dir);
            lgt.setNear(n);
            lgt.setFar(f);
            lgt.setInner(inner);
            lgt.setOuter(outer);
            lgt.setIntensity(intensity);
            lgt.setDropOff(dropoff);
            lgt.setLightCastShadowTo((shadow === "true"));

            lightSet.addToSet(lgt);
        }

        return lightSet;
    }

    parsePlatform(texture, normal, lightSet) {
        let elm = this._getElm("Platform");
        let i, j, x, y, v, r, p;
        let allPlatforms = [];
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            v = elm.item(i).attributes.getNamedItem("Velocity").value.split(" ");
            r = Number(elm.item(i).attributes.getNamedItem("MovementRange").value);
            // make sure color array contains numbers
            this._convertToNum(v);

            p = new Platform(x, y, v, r, texture, normal, lightSet);
            engine.layer.addToLayer(engine.layer.eActors, p);
            engine.layer.addAsShadowCaster(p);

            allPlatforms.push(p);
        }

        return allPlatforms;
    }


    parseMinions(texture, normal, lightSet) {
        let elm = this._getElm("Minion");
        let i, j, x, y, v, r, t, w, h, m;
        let allMinions = [];
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            v = elm.item(i).attributes.getNamedItem("Velocity").value.split(" ");
            r = Number(elm.item(i).attributes.getNamedItem("MovementRange").value);
            t = Number(elm.item(i).attributes.getNamedItem("Type").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);

            // make sure color array contains numbers
            this._convertToNum(v);
            switch (t) {
                case 0:
                    m = new Minion(x, y, v, r, t, texture, normal, lightSet, w, h);
                    break;
                case 1:
                    m = new SentryMinion(x, y, v, r, t, texture, normal, lightSet, w, h);
                    break;
                case 2:
                    m = new ChaserMinion(x, y, v, r, t, texture, normal, lightSet, w, h);
                    break;
            }
            engine.layer.addToLayer(engine.layer.eActors, m);
            engine.layer.addAsShadowCaster(m);

            allMinions.push(m);
        }

        return allMinions;
    }

    parseBoss(texture0, texture1, texture2,
        texture3, texture4, texture5, texture6, normal, lightSet, hero) {
        let elm = this._getElm("Boss");
        let i, j, x, y, v, r, t, b;

        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            v = elm.item(i).attributes.getNamedItem("Velocity").value.split(" ");
            r = Number(elm.item(i).attributes.getNamedItem("MovementRange").value);
            t = Number(elm.item(i).attributes.getNamedItem("Type").value);

            // make sure color array contains numbers
            this._convertToNum(v);

            b = new Boss(x, y, v, r, t, texture0, texture1, texture2,
                texture3, texture4, texture5, texture6, normal, lightSet, hero);

            engine.layer.addToLayer(engine.layer.eActors, b);
            engine.layer.addAsShadowCaster(b);
        }

        return b;
    }


    parseWall(texture, normal, lightSet) {
        let elm = this._getElm("Wall");
        let i, x, y, w;
        let allWalls = [];
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);


            w = new Wall(x, y, texture, normal, lightSet);
            engine.layer.addToLayer(engine.layer.eActors, w);
            engine.layer.addAsShadowCaster(w);

            allWalls.push(w);
        }

        return allWalls;
    }

    parseDoors(texture0, texture1, texture2, lightSet) {
        let elm = this._getElm("Door");
        let i, x, y, d;
        let allDoors = [];
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);

            d = new Door(x, y, texture0, texture1, texture2, lightSet);
            engine.layer.addToLayer(engine.layer.eActors, d);
            engine.layer.addAsShadowCaster(d);

            allDoors.push(d);
        }

        return allDoors;
    }

    parseButtons(texture, lightSet) {
        let elm = this._getElm("Button");
        let i, x, y, t, b;
        let allButtons = [];
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            t = Number(elm.item(i).attributes.getNamedItem("Type").value);

            b = new Button(x, y, texture, t, lightSet);
            engine.layer.addToLayer(engine.layer.eActors, b);
            engine.layer.addAsShadowCaster(b);

            allButtons.push(b);
        }

        return allButtons;
    }

    parseBackground(level, refCam, lightSet) {
        let elm = this._getElm("Background");
        let dir = "assets/" + level + "/";
        let i, j, x, y, z, w, h, p, t, n, bg, bgR, l, s;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            z = Number(elm.item(i).attributes.getNamedItem("ZPos").value);
            p = Number(elm.item(i).attributes.getNamedItem("ParallaxDepth").value);
            t = elm.item(i).attributes.getNamedItem("Texture").value;
            n = elm.item(i).attributes.getNamedItem("NormalMap").value;
            s = elm.item(i).attributes.getNamedItem("ReceiveShadow").value;
            l = elm.item(i).attributes.getNamedItem("LightIndices").value.split(" ");

            bgR = new engine.IllumRenderable(dir + t, dir + n);
            bgR.getXform().setSize(w, h);
            bgR.getXform().setPosition(x, y);
            bgR.getXform().setZPos(z);

            this._convertToNum(l);
            if (l[0] === -1) {
                for (j = 0; j < lightSet.numLights(); j++) {
                    bgR.addLight(lightSet.getLightAt([j]));
                }
            } else {
                for (j = 0; j < l.length; j++) {
                    bgR.addLight(lightSet.getLightAt(l[j]));
                }
            }
            bg = new engine.ParallaxGameObject(bgR, p, refCam);

            let sr;
            if (s === "true") {
                sr = new engine.ShadowReceiver(bg);
                engine.layer.addToLayer(engine.layer.eShadowReceiver, sr);
            } else {
                engine.layer.addToLayer(engine.layer.eBackground, bg);
            }

        }

    }

    parseNextLevel() {
        let elm = this._getElm("NextLevel");
        return elm[0].getAttribute("Next");
    }
}

export default SceneFileParser;