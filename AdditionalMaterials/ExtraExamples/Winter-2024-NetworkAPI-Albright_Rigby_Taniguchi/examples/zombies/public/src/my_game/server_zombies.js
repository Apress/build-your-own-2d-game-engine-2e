// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import { ServerBoundingBox } from "./server_bounding_box.js";

export class ServerZombies {
    constructor() {
        this.mZombies = [];
        this.mIDToChase = [];
        this.mLastUpdateTime = performance.now();
    }

    addNew(playerID) {
        let x, y;
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                x = Math.random() * 200 - 100;
                y = 78;
            break;
            case 1:
                x = 103;
                y = Math.random() * 150 - 75;
            break;
            case 2:
                x = Math.random() * 200 - 100;
                y = -78;
            break;
            case 3:
                x = -103;
                y = Math.random() * 150 - 75;
            break;
        }

        this.mZombies.push(new ServerBoundingBox([x, y], 10, 10));
        this.mIDToChase.push(playerID);
    }

    update(gs) {
        const speed = 20;

        let now = performance.now();
        let timeElapsed = (now - this.mLastUpdateTime) / 1000;
        let scale = speed * timeElapsed;
        this.mLastUpdateTime = now;

        for (let i = 0; i < this.mZombies.length; i++) {
            let pos = this.mZombies[i].getCenter();
            let playerToChase = this.mIDToChase[i];

            // delete zombie if player being chased disconnected
            if (gs[playerToChase] === undefined) {
                this.mZombies.splice(i, 1);
                this.mIDToChase.splice(i, 1);
                continue;
            }

            // 
            let playerPos = gs[playerToChase].mBBox.getCenter();
            let dist = [playerPos[0] - pos[0], playerPos[1] - pos[1]];
            let length = Math.sqrt((dist[0]*dist[0]) + (dist[1]*dist[1]));
            let direction = [dist[0] * (1/length), dist[1] * (1 /length)];

            this.mZombies[i].setBounds([pos[0] + (scale * direction[0]), pos[1] + (scale * direction[1])], 10, 10);
        }
    }

    getBBoxes() {
        return this.mZombies;
    }

    exportState() {
        let state = []
        for (let i = 0; i < this.mZombies.length; i++) {
            state.push([this.mZombies[i].getCenter()[0], this.mZombies[i].getCenter()[1]]);
        }
        return state;
    } 

    deleteZombie(i) {
        this.mZombies.splice(i, 1);
        this.mIDToChase.splice(i, 1);
    }

    setState(update) {
        throw "error: clients should not update server's Zombies state";
    }
}