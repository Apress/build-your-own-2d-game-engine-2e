// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// Demo 2: Zombie Game

"use strict";

import engine from "../engine/index.js";
import { ServerConnection } from "../../multiplayer/serverconnection.js";
import { ClientHero } from "./client_hero.js";
import { ClientProjectiles } from "./client_projectiles.js";
import { ClientZombies } from "./client_zombies.js";

class MyServerConnection extends ServerConnection {
    onConnect(packet) {
        console.log(packet);
        let gs = this.getContainer();

        for (const [k, v] of Object.entries(packet)) {
            gs[k] = new ClientHero(v);
        }

        gs.projectiles = new ClientProjectiles();
        gs.zombies = new ClientZombies();

        document.getElementById("playerInfo").innerHTML = "your player id: <b>" + this.getID() + "</b>";
    }

    onMessage(msg) {
        let chat = document.getElementById("chat");
        chat.innerHTML = chat.innerHTML + decodeURI(msg) + "<br>";
    }

    onPacket(packet) {
        let gs = this.getContainer();
        // create new hero.delete hero
        for (const [k, v] of Object.entries(packet)) {
            if (k === "zombies" || k === "projectiles") continue;
            if (gs[k] === undefined) {
                gs[k] = new ClientHero(v);
            } else if (v === null) {
                delete gs[k];
            }
        }
        this.getContainer().apply(packet);
    }

    beforeUpdate(packet) {
        // we only want to tell the server our position, it'll tell us everything else
        for (let [k, v] of Object.entries(packet)) {
            if (k !== this.getID().toString()) {
                delete packet[k];
            } else {
                delete packet[k].color;
                delete packet[k].health;
            }
        }
    }

    playerDied() {
        let id = this.getID();
        this.beforeUpdate = (p) => { p[id] = null };
    }
}

class MyGame extends engine.Scene {
    constructor() {
        super();
    }
  
    init() {
        this.mServerConnection = new MyServerConnection();
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0),     // position of the camera
            200,                       // width of camera, height is 150 in our case
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.mHealthText = new engine.FontRenderable("adfasdf");
        this.mHealthText.setColor([1, 1, 1, 1]);
        this.mHealthText.getXform().setPosition(-95, -70);
        this.mHealthText.setTextHeight(7);

        this.mPingText = new engine.FontRenderable("");
        this.mPingText.setColor([1, 1, 1, 1]);
        this.mPingText.getXform().setPosition(20, -70);
        this.mPingText.setTextHeight(5);

        this.mLastUpdateTime = performance.now();
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
            if (gs.projectiles !== undefined) { gs.projectiles.draw(this.mCamera); }
            if (gs.zombies !== undefined) { gs.zombies.draw(this.mCamera); }
        }
        
        this.mPingText.draw(this.mCamera);
        this.mHealthText.draw(this.mCamera);
    }

    shoot() {
        if (this.mServerConnection === undefined) return;

        let gs = this.mServerConnection.getContainer();

        let playerPos = gs[this.mServerConnection.getID()].getXform().getPosition();
        let mouseClick = [(engine.input.getMousePosX() - 320) / (640 / 200), (engine.input.getMousePosY() - 240) / (480 / 150)];
        let dist = [mouseClick[0] - playerPos[0], mouseClick[1] - playerPos[1]];
        let length = Math.sqrt((dist[0]*dist[0]) + (dist[1]*dist[1]));
        let scale = [dist[0] * (1/length), dist[1] * (1 / length)];
        
        this.mServerConnection.sendMessage(JSON.stringify(scale));
    }

    update() {
        const playerDelta = 40;

        let gs = this.mServerConnection.getContainer();
        let id = this.mServerConnection.getID();

        if (gs === undefined) return;

        // the server will delete us when we die
        if (gs[id] === undefined) {
            this.mHealthText.setText("you have died. game over");
            return;
        }

        // update client hero pos bbox and transform
        // delta is [x delta, y delta]
        let updatePos = (hero, delta) => {
            hero.getXform().getPosition()[0] += delta[0];
            hero.getXform().getPosition()[1] += delta[1];
            hero.mBBox.setBounds(hero.getXform().getPosition());
        }

        // the position of this might mess things up maybe?
        const now = performance.now();
        const secSinceLast = (now - this.mLastUpdateTime) / 1000;
        this.mLastUpdateTime = now;

        const d = playerDelta * secSinceLast;

        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            updatePos(gs[id], [0, d]);  
        }

        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            updatePos(gs[id], [-d, 0]);  
        }

        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            updatePos(gs[id], [0, -d]);  
        }

        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            updatePos(gs[id], [d, 0]); 
        }

        if (engine.input.isButtonClicked(engine.input.eMouseButton.eLeft)) {
            this.shoot();
        }

        if (secSinceLast >= (1 / 64)) {
            this.mServerConnection.update();
        }

        if (this.mServerConnection !== undefined) {
            this.mPingText.setText("ping: " + this.mServerConnection.getLatency() + " ms");
        }

        this.mHealthText.setText("hp: " + gs[id].mHealth);
        this.mHealthText.setColor([(100 - gs[id].mHealth) / 100, gs[id].mHealth / 100, 0, 1]);
    }
}

window.onload = function () {
    engine.init("GLCanvas");
    let myGame = new MyGame();
    myGame.start();
}
