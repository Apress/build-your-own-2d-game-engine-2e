// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import { ServerBoundingBox } from "./server_bounding_box.js";

export class ServerProjectiles {
    constructor() {
        this.mProjectiles = [];
        this.mDirection = [];
        this.mLastUpdateTime = performance.now();
    }

    addNew(playerPos, direction) {
        // this.mProjectiles.push([playerPos[0], playerPos[1], [delta[0], delta[1]]]);
        this.mProjectiles.push(new ServerBoundingBox([playerPos[0], playerPos[1]], 3, 3));
        console.log("position of added projectile: " + this.mProjectiles[this.mProjectiles.length - 1].getCenter());
        this.mDirection.push([direction[0], direction[1]]);
    }

    update() {
        const speed = 60; // 60 game units/second

        let now = performance.now();
        let timeElapsed = (now - this.mLastUpdateTime) / 1000;
        let scale = speed * timeElapsed;
        this.mLastUpdateTime = now;
        
        for (let i = 0; i < this.mProjectiles.length; i++) {
            let pos = this.mProjectiles[i].getCenter();
            this.mProjectiles[i].setBounds([pos[0] + (this.mDirection[i][0] * scale), pos[1] + (this.mDirection[i][1] * scale)], 3, 3);
            if ((pos[0] < -100) || (pos[0] > 100) || (pos[1] > 75) || (pos[1] < -75)) {
                this.mProjectiles.splice(i,1);
                this.mDirection.splice(i,1);
            }
        } 
    }

    getBBoxes() {
        return this.mProjectiles;
    }

    exportState() {
        let state = [];

        for (let i = 0; i < this.mProjectiles.length; i++) {
            let pos = this.mProjectiles[i].getCenter();
            state.push([pos[0], pos[1]]);
        }

        return state;
    } 

    setState(update) {
        throw "error: clients should not update server's Projectiles state";
    }
}