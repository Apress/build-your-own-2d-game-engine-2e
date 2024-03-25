// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import Renderable from "../engine/renderables/renderable.js";

export class ClientProjectiles {
    constructor() {
        this.mProjectiles = [];
    }
    draw(camera) {
        for (let i = 0; i < this.mProjectiles.length; i++) {
            this.mProjectiles[i].draw(camera);
        }
    }
    exportState() {
        // client does not send projectile updates to server
        return {};
    }
    setState(packet) {
        this.mProjectiles = [];
        for (let i = 0; i < packet.length; i++) {
            if (this.mProjectiles[i] === undefined) {
                this.mProjectiles[i] = new Renderable();
                this.mProjectiles[i].setColor([1, 0, 0, 1]);
                this.mProjectiles[i].getXform().setSize(2,2);
            }
            this.mProjectiles[i].getXform().setPosition(packet[i][0], packet[i][1]);
        }
    }
}
