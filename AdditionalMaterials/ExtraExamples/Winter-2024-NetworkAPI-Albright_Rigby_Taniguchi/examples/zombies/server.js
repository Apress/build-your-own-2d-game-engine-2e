// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

"use strict";

import { GameServer } from "./public/multiplayer/gameserver.js";
import { ServerHero } from "./public/src/my_game/server_hero.js";
import { ServerProjectiles } from "./public/src/my_game/server_projectiles.js";
import { ServerZombies } from "./public/src/my_game/server_zombies.js";

/*

Layout of this demo's GameState
{
    player id:
    {
        pos: [x, y]
        color: [r, g, b, a]
        health: number
    }
    zombies: [ [x, y], [x, y], ...]
    projectiles: [ [x, y], [x, y], ... ]
}

The server will hold on to the:
- player the zombies are chasing
- delta for the projectile

*/

class MyGameServer extends GameServer {
    onInit() {
        let gs = this.getContainer();
        gs.projectiles = new ServerProjectiles();
        gs.zombies = new ServerZombies();

        this.mLastZombieTime = performance.now();

        this.mConnectedIDs = [];
    }
    onConnect(playerID) {
        console.log(playerID + " connected");
        let gs = this.getContainer();
        gs[playerID] = new ServerHero();
        this.mConnectedIDs.push(playerID);
        // console.log(gs[playerID]);
    }

    onPacket(p, id) {
        console.log(p);
        let cleanPacket = {};

        if (p[id] !== undefined) {
            cleanPacket[id] = p[id];
        }
        
        // cleanPacket should only contain client's pos
        this.getContainer().apply(cleanPacket);
    }

    onDisconnect(id) {
        let gs = this.getContainer();
        delete gs[id];
        this.mConnectedIDs.splice(this.mConnectedIDs.indexOf(id), 1);
    }

    beforeUpdate(packet, id) {
        // don't tell the client about their position, they tell us
        console.log(this.getContainer().capture());
        if (packet[id] !== undefined && packet[id] !== null) {
            console.log(packet[id]);
            delete packet[id].pos;
            if (packet[id].health <= 0) {
                delete this.getContainer()[id];
                this.mConnectedIDs.splice(this.mConnectedIDs.indexOf(id), 1);
            }
        }
        // if (Object.keys(packet).length !== 0) console.log(packet);
    }

    onMessage(msg, id) {
        // adds projectile
        console.log("message from " + id + ": " + msg);
        let gs = this.getContainer();
        // TODO fix disconnect message
        if (gs.projectiles === undefined) return;
        let delta = JSON.parse(msg);
        let pos = gs[id].mBBox.getCenter();
        gs.projectiles.addNew([pos[0], pos[1]], delta);
    }

    /**
     * Potential Zombie Math
     * gs[zombie].update(gs[zombie.ID].(playerPosx)],gs[zombie.ID].(PlayerPosY))
     * update(playerX, PlayerY){
     *       ZombieX = ZombieX + (playerXDirection * scale);
             ZombieY = ZombieY + (playerYDirection * scale);
     * }
     */
    updateGame() {
        // every 2 seconds spawn a zombie which chases one of the players
        // maybe make the spawn time proportional to number of players,
        // the more players there are more zombies spawn
        // zombies should spawn outside the viewport
        
        let gs = this.getContainer();

        let now = performance.now();

        // add zombie collision with projectiles here

        // if (this.) {
        //     this.mServerZombies.addNew(randomPlayerID);
        // }
        if (gs.projectiles === undefined) return;
        if (gs.zombies === undefined) return;

        gs.zombies.update(this.getContainer());
        gs.projectiles.update();

        let zombieBBs = gs.zombies.getBBoxes();
        let projectileBBs = gs.projectiles.getBBoxes();

        for (let i = 0; i < zombieBBs.length; i++){
            for (let j = 0; j < projectileBBs.length; j++) {
                if (zombieBBs[i] == undefined) continue;
                if (zombieBBs[i].intersectsBound(projectileBBs[j])){
                    gs.zombies.deleteZombie(i);
                }
            }
            for (const [k, v] of Object.entries(gs)) {
                if (k === "zombies" || k === "projectiles") continue;
                if (zombieBBs[i] == undefined) continue;
                if (zombieBBs[i].intersectsBound(gs[k].mBBox)) {
                    gs[k].mHealth -= 10;
                    gs.zombies.deleteZombie(i);
                }
            }
        }
        // math.random() * gs.id.length - 1 
        if (now - this.mLastZombieTime >= 1000 && this.mConnectedIDs.length != 0) {
            gs.zombies.addNew(this.mConnectedIDs[Math.floor(Math.random() * this.mConnectedIDs.length)]);
            this.mLastZombieTime = now;
        }
    }
}

let s = new MyGameServer();

setInterval(() => {
    s.update();
    s.updateGame();
}, 1000 / 64); // 64 tick