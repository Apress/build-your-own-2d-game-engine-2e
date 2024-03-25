## Multiplayer API Documentation
#### Final Project for CSS 452, Winter 2024
#### Group 1: Matt Taniguchi, Drew Rigby, Ethan Albright
Welcome to the documentation for Group 1's multiplayer API.

### Overview
This API can be used to develop multiplayer games using a client-server architecture.

A Node.js server is used to host an HTTP and WebSocket server.

Web browsers act as the clients which connect to the HTTP/WebSocket server.

Our demos can be found in the `examples` folder.

### Usage
Development using this engine is similar to the original engine, except that:
- The developer needs to overload the `GameServer` and `ServerConnection` classes in order to implement multiplayer functionality for their game
- The server is ran by instantiating the `GameServer` on the Node.js server
- The client connects to the server by instantiating a `ServerConnection` in the web browser

The code in `my_game.js` and `app.js` can be used as a starting template for working with this engine.

The client and server share one object known as the `GameStateContainer`. Modifications to this object are tracked, and the client or server can update one another through sending packets with `GameServer` or `ServerConnection`'s `update()` function.

There is also messaging functionality, where the client can send/receive strings to/from the server (and vice versa) using the `sendMessage()` and `onMessage()` functions.

Only instances of classes which implement the `exportState()` and `setState()` functions can be inserted into the `GameStateContainer`. Please see the `GameStateContainer` documentation for more details.

### Running
In order to use this game engine, you will need to install [Node.js](https://nodejs.org).

After installing Node, you will need to do the following:
- Run `npm install` in the root directory of this repository. This installs the dependencies for the server.
- Run `node server.js` to start the server. The address and port number of the server should be printed into the terminal.
- Open your web browser and navigate to the server's address. For us, this was usually `localhost:8080`.
  - Others can connect to your server on your local network. You will need to find your local IP address. Append your local IP address with the port number. Others should be able to navigate to this address and connect to your server.

Do not expose the Node.js server's port to the internet. Do not port forward the port or turn off your firewall. Security was not considered at all during the development of this engine. We are not liable if you expose the port to the internet and get hacked. If you want others to be able to connect to your server without being on the same local network, use a VLAN provider like Hamachi or Tailscale.

In order to run the provided examples:
- Navigate into the desired example in the `examples` folder
- Run `npm install` and `node server.js`

We suggest using `nodemon` when developing games using this engine. `nodemon` automatically restarts the Node.js application upon file changes.
- Install nodemon with `npm install -g nodemon`.
- Run `nodemon server.js`.

### Changed Files
- We had to restructure the engine into the `public` folder. The `public` folder serves as the index of the HTTP server.
- We added the `multiplayer` folder.
- Some classes, such as `BoundingBox` or `Renderable`, were slightly modified. Most files in the engine remain exactly the same.

### Limitations/Conclusion
- There are probably plenty of bugs still present. Writing tests could help spot some of them.
- Some edge cases are not handled by the API. The `TODO` comments should serve as a good starting place for fixing them.
- Using TypeScript might have helped simplify many parts of this API.