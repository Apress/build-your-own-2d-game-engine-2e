/*
 * File: SceneFile_Parse.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// from engine
import engine from "../../engine/index.js";

class SceneFileParser {
    constructor(sceneFilePath) {
        this.mSceneXml = engine.text.get(sceneFilePath);
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
        let j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }

        let cam = new engine.Camera(
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor);
        return cam;
    }

    parseSquares(sqSet) {
        let elm = this._getElm("Square");
        let i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            sq = new engine.Renderable();
            // make sure color array contains numbers
            for (j = 0; j < 3; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }

    parseTextureSquares(sqSet) {
        let elm = this._getElm("TextureSquare");
        let i, j, x, y, w, h, r, c, t, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            t = elm.item(i).attributes.getNamedItem("Texture").value;
            sq = new engine.TextureRenderable(t);
            // make sure color array contains numbers
            for (j = 0; j < 4; j++)
                c[j] = Number(c[j]);
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
}

export default SceneFileParser;