// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import { ServerBoundingBox } from "./server_bounding_box.js";

export class ServerHero {
    constructor() {
        this.mBBox = new ServerBoundingBox([(Math.random() * 50) - 20, (Math.random() * 50) - 20], 8, 8);
        this.mColor = [Math.random(), Math.random(), Math.random(), 1];
        this.mHealth = 100;
    }

    exportState() {
        return {
            pos: [this.mBBox.getCenter()[0], this.mBBox.getCenter()[1]],
            color: [...this.mColor],
            health: this.mHealth
        };
    }

    setState(update) {
        // info
        if (update.pos != undefined) {
            this.mBBox.setBounds([update.pos[0], update.pos[1]], 8, 8);
        }

        // color
        if (update.color != undefined) {
            this.setColor(update.color);
        }

        // health 
        if (update.health != undefined) {
            this.mHealth = update.health;
        }
    }
}