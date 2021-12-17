/*
 * File: my_game.js
 *
 *       interface file to the index.html
 */

import engine from "../engine/index.js";
import MyGame from "./my_game_bounds.js";


window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}