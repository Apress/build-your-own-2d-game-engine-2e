// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// server.js template

"use strict";

import { GameServer } from "./public/multiplayer/gameserver.js";

class MyGameServer extends GameServer {
    // Your code here...
}

let s = new MyGameServer();

// setInterval(() => {
//     s.update();
// }, 1000 / 64); // 64 tick