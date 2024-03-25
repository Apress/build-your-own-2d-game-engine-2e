// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

import Renderable from "../engine/renderables/renderable.js";

export class ClientHero extends Renderable {
    constructor(serverState) {
        super();
        this.getXform().setSize(10, 10);
        this.setState(serverState);
        console.log(this.getColor());
    }
    exportState() {
        return {
            pos: [ this.getXform().getXPos(), this.getXform().getYPos() ],
            color: [...this.getColor()] 
        }
    }
    setState(update) {
        this.getXform().setPosition(update.pos[0], update.pos[1]);
        this.setColor(update.color);
    }
}
