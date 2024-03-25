// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// Demo 1: Squares and Chat

"use strict";

import engine from "../engine/index.js";
import { ServerConnection } from "../../multiplayer/serverconnection.js";
import { ClientHero } from "./client_hero.js";

class MyServerConnection extends ServerConnection {
    onConnect(packet) {
        let gs = this.getContainer();

        for (const [k, v] of Object.entries(packet)) {
            gs[k] = new ClientHero(v);
        }

        setupChat((msg) => { this.sendMessage(msg) });
        document.getElementById("playerInfo").innerHTML = "your player id: <b>" + this.getID() + "</b>";
    }

    onMessage(msg) {
        let chat = document.getElementById("chat");
        chat.innerHTML = chat.innerHTML + msg + "<br>";
    }

    onPacket(update) {
        let gs = this.getContainer();
        for (const [k, v] of Object.entries(update)) {
            if (gs[k] === undefined) gs[k] = new ClientHero(v);
            if (v === null) delete gs[k];
        }
        gs.apply(update);
    }
}

class MyGame extends engine.Scene {
    constructor() {
        super();
    }

    init() {
        this.mServerConnection = new MyServerConnection();
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0), // position of the camera
            200,                       // width of camera, height is 150 in our case
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.mLatency = new engine.FontRenderable("");
        this.mLatency.setColor([1, 1, 1, 1]);
        this.mLatency.getXform().setPosition(-95, -70);
        this.mLatency.setTextHeight(5);

        this.mLastUpdateTime = performance.now();
        this.mLastPingTime = performance.now();

        setupChat();
    }

    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        let gs = this.mServerConnection.getContainer();

        if (gs !== undefined) {
            // iterate through gs, draw all clientHeros
            for (const [k, v] of Object.entries(gs)) {
                if (gs[k] !== undefined) gs[k].draw(this.mCamera);
            }
        }

        this.mLatency.draw(this.mCamera);
    }

    update() {
        let id = this.mServerConnection.getID();
        let gs = this.mServerConnection.getContainer();
        let delta = 0.5;

        if (document.activeElement !== document.getElementById("chatInput")) {
            if (engine.input.isKeyPressed(engine.input.keys.W)) {
                gs[id].getXform().incYPosBy(delta);
            }
            if (engine.input.isKeyPressed(engine.input.keys.A)) {
                gs[id].getXform().incXPosBy(-delta);
            }
            if (engine.input.isKeyPressed(engine.input.keys.S)) {
                gs[id].getXform().incYPosBy(-delta);
            }
            if (engine.input.isKeyPressed(engine.input.keys.D)) {
                gs[id].getXform().incXPosBy(delta);
            }
            if (engine.input.isKeyPressed(engine.input.keys.J)) {
                let color = gs[id].getColor();
                color[0] += 5/255;
                color[0] %= 1;
            }
        }

        const currTime = performance.now();

        // only send 64 updates per second at most
        if (currTime - this.mLastUpdateTime >= (1000 / 64)) {
            this.mLastUpdateTime = currTime;
            this.mServerConnection.update();
        }

        // get ping every second
        if (currTime - this.mLastPingTime >= 1000) {
            this.mLastPingTime = currTime;
            this.mServerConnection.getLatency((lat) => { this.mLatency.setText("ping: " + Math.round(lat) + " ms") });
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");
    let myGame = new MyGame();
    myGame.start();
}

function setupChat(sendMsgFunc) {
    let send = () => {
        let input = document.getElementById("chatInput");
        let msg = input.value;
        sendMsgFunc(msg);
        input.value = "";
        console.log(msg); 
    }
    document.getElementById("chatInput").onkeydown = (e) => {
        if (e.key === 'Enter') {
            send();
            return false;
        } else {
            return e;
        }
    }
    document.getElementById("sendMsg").onclick = send;
}