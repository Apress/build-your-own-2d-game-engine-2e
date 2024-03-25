Let's make a game where the first player to press the Space bar 100 times wins.

We will implement this game two different ways:
1. using the shared `GameStateContainer`
2. through sending messages back and forth between the client and server

This brief tutorial provides an overview of how our API is used.

---
Let's first start by seeing how we could implement this game using the `GameStateContainer`.

### 1. `GameStateContainer`: Client-side/Server-side `Player`
These classes would be defined in a file that is imported from by both the client and server.
Instances of both of these classes are put into the `GameStateContainer`.
Importantly, notice how the format of the object returned by `exportState()` and consumed by `setState()` are the exact same format between both classes.

```js
class ClientPlayer {
    // initialize client data
    // `gs` is the exportState() from the server (from a ServerPlayer)
    constructor(gs) {
        this.setState(gs);
    }

    // update client data using contents of packet from server
    setState(p) {
        this.mPresses = p.presses;
        this.mWon = p.won;
    }

    // we should not export `won`, this will be set by the server
    exportState() {
        return {
            presses: this.mPresses
        }
    }
}

class ServerPlayer {
    // create a new player, the server is the one who initializes the player's state
    constructor() {
        this.mPresses = 0;
        this.mWon = false;
    }

    // set state using update from client
    setState(p) {
        this.mPresses = p.presses;
    }

    exportState() {
        return {
            presses: this.mPresses,
            won: this.mWon
        }
    }
}
```

### 2. `GameStateContainer`: `GameServer`
Let's make a basic `GameServer`.

The server for this game should do the following:
- create a new Player (`ServerPlayer`) when a player connects
- receives updates from clients (which change the space press counter)
- sends updates to clients periodically
- sets a Player's `won` to true if they passed 100 presses

```js
class MyGameServer extends GameServer {
    // construct and add new player to container
    onConnect(id) {
        let gs = this.getContainer();
        gs[id] = new ServerPlayer();
    }

    // receive packet from player, see if player won
    onPacket(p, id) {
        let gs = this.getContainer();
        gs.apply(p);

        // it's not `presses` or `won` here, it's `mPresses`/`mWon`, we're modifying the class!
        if (gs[id].mPresses >= 100) {
            gs[id].mWon = true;
        }
    }
}
```

### 3. `GameStateContainer`: `ServerConnection`
Now let's take a look at what's running on the client side in our `ServerConnection`.
This class could be put in `my_game.js` or in another file imported on the client side.

```js
class MyServerConnection extends ServerConnection {
    onInit() {
        this.mGameWinner = null;  // set to the player id of the winner, null if game is not done
    }

    onConnect(gameState) {
        let gs = this.getContainer();

        // create client side players, including ourselves
        for (const [k, v] of Object.entries(gameState)) {
            gs[k] = new ClientPlayer(v);
        }
    }

    onPacket(packet) {
        let gs = this.getContainer();
        
        // set winner
        for (const [k, v] of Object.entries(packet)) {
            if (v.won === true) {
                this.mGameWinner = k;
            }
        }

        gs.apply(packet);
    }

    // the following functions are not abstract functions,
    // they're used in the game logic
    getWinner() {
        return this.mGameWinner;
    }

    getPresses() {
        let gs = this.getContainer();
        return gs[this.getID()].mPresses;
    }

    spacePressed() {
        let gs = this.getContainer();
        gs[this.getID()].mPresses++;
    }
}
```

### 4. `GameStateContainer`: `my_game.js`
`my_game.js` is the entry point of the client-side code. We will use our `ServerConnection` here.

```js
class MyGame extends engine.Scene {
    // ...
    init() {
        // ...
        this.mConnection = new MyServerConnection();
        // ...
    }

    draw() {
        // ...
        if (this.mConnection.getWinner() == null) { 
            drawSomeTextOrSomething(this.mConnection.getPresses());
        } else {
            drawSomeTextOrSomething("Player " + this.mConnection.getWinner() + " won the game!");
        }
        // ...
    }

    update() {
        // ...
        this.mConnection.update(); // update server of changes to the container

        if (spaceWasClicked()) {
            this.mConnection.spacePressed();
        }
        // ...
    }
    // ...
}
```

### 5. `GameStateContainer`: `server.js`
Now we'll take a look at the server's entry point, `server.js`, and see how `GameServer` is used.

```js
let s = new MyGameServer();

setInterval(() => {
    s.update();
}, 1000 / 64); // 64 tick
```

The server doesn't need to do much! We can now run our game with `node server.js`.

---
Now let's take a look at how we can implement the same game using `sendMessage()` and `onMessage()`.

We will not be using any `Player` classes on the client or server! We will manually store the state.

### 1. Messaging: `GameServer`
Let's start with the `GameServer`.

```js
class MyGameServer extends GameServer {
    onInit() {
        this.mPresses = {};
    }

    onConnect(id) {
        this.mPresses[id] = 0;
    }

    onMessage(msg, id) {
        this.mPresses[id] = Number(msg);

        // update other players, tell them this player's presses
        // notice no player id given to sendMessage(), this sends the message to all players
        this.sendMessage(id + ":" + this.mPresses[id]);
    }
}
```

### 2. Messaging: `ServerConnection`
```js
class MyServerConnection extends ServerConnection {
    onInit() {
        this.mPresses = {};
        this.mGameWinner = null;
    }

    onConnect() {
        this.mPresses[this.getID()] = 0;
    }

    onMessage(msg) {
        let splitMsg = msg.split(":");
        let id = Number(splitMsg[0]);
        let val = Number(splitMsg[1]);
        this.mPresses[id] = val;
        if (this.mPresses[id] >= 100) {
            this.mGameWinner = id;
        }
    }

    getWinner() {
        return this.mGameWinner;
    }

    getPresses() {
        return this.mPresses[this.getID()];
    }

    spacePressed() {
        this.mPresses[this.getID()]++;
        this.sendMessage(gs[this.getID()].toString());
    }
}
```

### 3. Messaging: `my_game.js`
We should be able to use the exact same code from the previous `my_game.js` here!

```js
class MyGame extends engine.Scene {
    // ...
    init() {
        // ...
        this.mConnection = new MyServerConnection();
        // ...
    }

    draw() {
        // ...
        if (this.mConnection.getWinner() == null) { 
            drawSomeTextOrSomething(this.mConnection.getPresses());
        } else {
            drawSomeTextOrSomething("Player " + this.mConnection.getWinner() + " won the game!");
        }
        // ...
    }

    update() {
        // ...

        // one small difference here, we don't need to update() the `ServerConnection`
        // since we aren't using the container!

        if (spaceWasPressed()) {
            this.mConnection.spacePressed();
        }
        // ...
    }
    // ...
}
```

### 4. Messaging: `server.js`
Our code for the server is even shorter!

```js
let s = new MyGameServer();
```

The `GameServer` knows not to shut down until `close()` is called or the user ends the Node.js process. Again, we can run the game with `node server.js`.