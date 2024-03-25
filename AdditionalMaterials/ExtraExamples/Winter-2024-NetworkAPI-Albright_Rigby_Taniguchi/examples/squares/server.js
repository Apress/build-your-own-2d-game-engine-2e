// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

"use strict";

import { GameServer } from "./public/multiplayer/gameserver.js";
import { ServerHero } from "./public/src/my_game/server_hero.js";

class MyGameServer extends GameServer {
    onConnect(playerID) {
        console.log(playerID + " connected");
        let gs = this.getContainer();
        gs[playerID] = new ServerHero();
        console.log(gs[playerID]);
    }
    onPacket(p, id) {
        let gs = this.getContainer();

        // We filter a player's packet to only contain information about their position
        let cleanPacket = {};
        if (p[id] !== undefined) cleanPacket[id] = p[id];
        this.getContainer().apply(cleanPacket);
    }
    onDisconnect(id) {
        let gs = this.getContainer();
        delete gs[id];
    }
    beforeUpdate(packet, id) {
        // Remove any information about the player's position
        // The player is the one telling us their position, we relay it to the other clients
        // We don't need to tell them their position again
        delete packet[id];
        // for (let [k, v] of Object.entries(packet)) {
        //     if (k === id.toString()) delete packet[id];
        // }
    }
    onMessage(msg, id) {
        this.sendMessage("player " + id + ": " + msg);
    }
}

let s = new MyGameServer();

setInterval(() => {
    s.update();
}, 1000 / 64); // 64 tick