// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

export class ServerHero {
    constructor() {
        this.mPos = [ Math.random() * 20 - 10, Math.random() * 20 - 10 ];
        this.mColor = [ Math.random(), Math.random(), Math.random(), 1];
    }
    exportState() {
        return {
            pos: this.mPos, 
            color: this.mColor
        }
    }
    setState(update) {
        this.mPos = update.pos;
        this.mColor = update.color;
    }
}