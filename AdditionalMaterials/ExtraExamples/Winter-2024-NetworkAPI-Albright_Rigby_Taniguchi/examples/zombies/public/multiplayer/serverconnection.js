// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// serverconnection.js: ServerConnection class

import { Messages } from "./multiplayer.js";
import { GameState } from "./gamestate.js";

/**
 * Manages the client's side of the game.
 * 
 * 
 * **This class should only be instantiated on clients (web browsers)**
 * 
 * 
 * **Users of this API should inherit from this class and overwrite the abstract functions.**
 * 
 * @class
 */
export class ServerConnection {
    /**
     * Constructs a new ServerConnection.
     * Immediately attempts to establish a connection to the GameServer.
     * @constructor
     */
    constructor() {
        if (typeof window === 'undefined') {
            throw "Error: attempted to construct a ServerConnection on the server.";
        }

        this.mGameState = new GameState();
        this.sendFull = false;

        // these are set in the initial packet
        this.mPlayerID = undefined;
        this.mPlayerInfo = undefined;  // TODO playerInfo is only sent once and not updated

        this.mSocket = new WebSocket(`ws://${location.host}`);

        // register event handlers
        this.mSocket.addEventListener("message", (event) => {
            this.#messageHandler(event.data);
        })

        // TODO this is sometimes unreliable if you open/close window too quickly
        // (the message won't get sent), causes server to think player is still connected
        // a solution to this would be adding timing out in GameServer's periodic ping
        window.addEventListener('beforeunload', (e) => {
            this.mSocket.send(Messages.Disconnect);
        });

        let me = this;
        // update ping to server
        setInterval(() => {
            let pingTime = performance.now();
            me.#sendSystemMessage(Messages.Ping);
            me.pongCb = () => {
                // TODO server time out (client can't reach server) could be added here
                me.mLatency = Math.round(performance.now() - pingTime);
            }
        }, 1000);
    }

    /**
     * Returns true if a connection was successfully established to the GameServer.
     * @method
     * @returns {boolean}
     */
    isConnected() {
        return this.mSocket.readyState === this.mSocket.OPEN;
    }

    /**
     * Returns the latency to the game server (in ms).
     * Returns undefined if the latency is unavailable.
     * @returns {(number | undefined)}
     * @method
     */
    getLatency() {
        return this.mLatency;
    }

    /**
     * Returns this `ServerConnection`'s `GameStateContainer`.
     * @method
     * @returns {GameStateContainer}
     */
    getContainer() {
        return this.mGameState.getContainer();
    }

    /**
     * Returns the player ID allocated to this client by the GameServer.
     * @method
     * @returns {number}
     */
    getID() {
        return this.mPlayerID;
    }

    /**
     * Returns the number of players connected to this server. 
     * @returns {number} number of players connected to this server
     */
    getNumConnected() {
        return this.mPlayerInfo[0];
    }

    /**
     * Returns the maximum number of players that can connect to this server.
     * @returns {number} maximum number of players that can connect to this server
     */
    getMaxNumPlayers() {
        return this.mPlayerInfo[1];
    }

    /**
     * Sends a GameStateContainer update packet to the GameServer.
     * A packet will not be sent if no changes have occurred to the GameStateContainer.
     * @method
     */
    update() {
        let packet = this.sendFull ? this.mGameState.getContainer().capture() : this.mGameState.generateUpdate();

        if (this.isConnected()) {
            if (Object.keys(packet).length !== 0) {
                if (this.sendFull) {
                    this.beforeUpdate(packet, true);
                    this.sendFull = false;
                } else {
                    this.beforeUpdate(packet, false);
                }
                if (Object.keys(packet).length !== 0) this.mSocket.send(JSON.stringify(packet));
            }
        } else {
            throw "ServerConnection: tried to update() without valid connection";
        }
    }

    /**
     * Sends a message to the GameServer.
     * @param {string} message the message to send to the server
     * @method
     */
    sendMessage(message) {
        if (!this.isConnected()) {
            throw "ServerConnection: attempted to sendMessage without a connection";
        }

        this.mSocket.send(Messages.messageOut(message));
    }

    // used to send system message
    #sendSystemMessage(message) {
        this.mSocket.send(message);
    }

    /**
     * Sends a request to the server to send a full copy of its GameState
     * in its next update.
     * @method
     */
    requestFull() {
        if (!this.isConnected()) {
            throw "ServerConnection: attempted to requestFull without a connection";
        }
        this.#sendSystemMessage(Messages.RequestFull);
    }

    #messageHandler(msg) {
        msg = msg.toString();
        if (msg[0] === '{') {
            // initially the server will send the client an object containing the following:
            // - playerID: player id
            // - playerInfo: array of [ num connected players, max players ]
            // - gameState: an initial copy of the GameState
            let obj = JSON.parse(msg);

            // we can tell if it's initial packet if player id undefined
            if (this.mPlayerID === undefined) {
                this.mPlayerID = obj.playerID;
                this.mPlayerInfo = obj.playerInfo;
                this.onConnect(obj.gameState);
            } else {
                // otherwise its just a gamestate update packet
                this.onPacket(obj);
            }
        } else if (Messages.hasPrefix(msg)) {
            // escaped user message
            this.onMessage(Messages.removePrefix(msg));
        } else {
            // regular user message or system message
            switch (msg) {
                case Messages.Ping:
                    this.#sendSystemMessage(Messages.Pong);
                    break;
                case Messages.Pong:
                    if (typeof this.pongCb !== "function") throw "received pong without ping?";
                    else this.pongCb();
                    delete this.pongCb;
                    break;
                case Messages.requestFull:
                    this.sendFull = true;
                    break;
                default:
                    this.onMessage(msg);
                    break;
            }
        }
    }

    disconnect() {
        this.mSocket.close();
    }

    // Abstract method stubs:

    /**
     * Called when this client first connects to the `GameServer`.
     * Takes a full copy of the server's `GameStateContainer`.
     * @param {object} gameState a full copy of the server's `GameStateContainer`
     * @abstract
     * @method
     */
    onConnect(gameState) {
        console.warn("ServerConnection: onConnect() has not been overwritten!");
    }

    /**
     * Called when the connection to the server was suddenly lost.
     * For example, this method would be called if a client lost connection to the internet.
     * @abstract
     * @method
     */
    onDisconnect() {
        console.warn("ServerConnection: onDisconnect() has not been overwritten!");
    }

    /**
     * Called when the server sent an update packet.
     * @param {object} packet a GameState update packet
     * @abstract
     * @method
     */
    onPacket(packet) {
        console.warn("ServerConnection: onPacket() has not been overwritten!");
    }

    /**
     * Called when the server sent a message.
     * @param {string} message the message from the server
     * @abstract
     * @method
     */
    onMessage(message) {
        console.warn("ServerConnection: onMessage() has not been overwritten!");
    }

    /**
     * Called before an update packet is sent to the server.
     * This allows for modifications to the content of the packet before it is sent.
     * An empty packet will not be sent to the server.
     * @param {object} packet the update packet
     * @param {boolean} isFull whether the packet is a full copy of the GameStateContainer
     * @abstract
     * @method
     */
    beforeUpdate(packet, isFull) {
        console.warn("ServerConnection: beforeUpdate() has not been overwritten!");
    }
} 
