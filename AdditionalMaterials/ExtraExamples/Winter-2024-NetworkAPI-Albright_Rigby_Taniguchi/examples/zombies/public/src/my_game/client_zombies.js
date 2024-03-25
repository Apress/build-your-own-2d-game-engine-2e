// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import Renderable from "../engine/renderables/renderable.js";

export class ClientZombies {
    constructor() {
        this.mZombies = [];
    }
    draw(camera) {
        for (let i = 0; i < this.mZombies.length; i++) {
            this.mZombies[i].draw(camera);
        }
    }
    exportState() {
        // the client will never update the state of the zombies!
        // server gives position and does collision
        return {}; 
    }
    setState(packet) {
        // console.log(packet);
        this.mZombies.length = packet.length;
        for (let i = 0; i < packet.length; i++) {
            if (this.mZombies[i] === undefined) {
                this.mZombies[i] = new Renderable();
                this.mZombies[i].getXform().setSize(10, 10),
                this.mZombies[i].setColor([0,0,0,1])
            }
            this.mZombies[i].getXform().setPosition(packet[i][0], packet[i][1]);
        }
    }
}
