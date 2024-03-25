// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// gamestate.js: GameStateContainer and GameState classes

import { deepCopy } from "./multiplayer.js";

// private helpers
function isValidType(v) { return (typeof v === "number" || typeof v === "boolean" || typeof v === "string" || typeof v === "object" || v === null) }
function isValidClass(v) { return (typeof v === "object" && typeof v.exportState === "function" && typeof v.setState === "function") }

// recursive helper which checks the properties and types of exportState()s
function validateExportedState(obj) {
    if (typeof obj !== "object") {
        throw "GameState error: exportState() returned " + typeof obj + ", should be an object";
    }
    if (Object.getOwnPropertySymbols(obj).length !== 0) {
        throw "GameState error: exportState() object contains Symbol: " + obj;
    }
    
    if (!(obj.constructor.name === "Object" || obj.constructor.name === "Array")) {
        // TODO see if it's possible to iterate over prototype and see if there are methods?
        // this works for now though
        throw "GameState error: object cannot be an instance of a class";
    }

    if (obj === null) {
        throw "GameState error: exportState() returned null"
    }

    for (let k in obj) {
        let v = obj[k];
        if (!isValidType(v)) {
            throw "GameState error: exportState() object property \"" + k + "\" contains a(n) " + typeof v + ", this type is not allowed";
        }
        if (typeof v === "object") {
            validateExportedState(v);
        }
    }
}

// checks if two exportState() objects are different
// prev and curr are both exportState() objects
// assuming both are valid
// note: watch out for property key/value types! keys seem to be strings sometimes when they're originally numbers...
function hasChanged(prev, curr) {
    // TODO sometimes hasChanged gets called with null or undefined which is not a big issue
    // but it shouldnt happen. this bug could be fixed. this check handles this case
    if (prev == null || prev == undefined || curr == null || curr == undefined) {
        console.warn("error: hasChanged contained null or undefined");
        return true;
    }

    if (Object.entries(prev).length !== Object.entries(curr).length) return true;

    let prevKeys = Object.keys(prev).sort();
    let currKeys = Object.keys(curr).sort();

    for (let i = 0; i < prevKeys.length; i++) {
        let prevProp = prevKeys[i];
        let currProp = currKeys[i];
        
        if (prev[prevProp] !== curr[currProp]) {
            // different objects are never ===
            if (typeof prev[prevProp] === "object" && typeof curr[currProp] === "object") {
                // if exportState() contains object or array do recursive call
                if (hasChanged(prev[prevProp], curr[currProp])) return true;
            } else return true;
        }
    }

    return false;
}

/**
 * A synchronized container for game state.
 * 
 * To insert an object into the container, simply set it as a property.
 * 
 * For example:
 * ```container.myThing = new Thing()```
 * 
 * You are only able to insert instances of classes which implement
 * `exportState()` and `setState(update)`. These functions are respectively used to generate and consume packets.
 * 
 * You can think of a container as an `Object` that you can only insert
 * `exportState()`/`setState()`-implementing class instances into:
 * 
 * - `exportState()`: returns an `Object` containing desired state to share
 * - `setState(update)`: consumes an `Object` returned by `exportState()`, updates state
 * 
 * You cannot overwrite the `capture()` or `apply(packet)` functions.
 * 
 * The object returned by `exportState()` cannot be `null`. This is reserved.
 * The object returned by `exportState()` cannot have `Symbol`s as property keys,
 * all keys must be `String`s.
 * 
 * The `Object` returned by `exportState()` can have property values of the following types:
 * - `Number` 
 * - `String`
 * - `Boolean`
 * - `null`
 * - `Object`s or `Array`s (which can be nested) that only contain the previous four types.
 *   - **You must ensure that all `Object`s and `Array`s in the returned object are not references to existing `Object`s/`Array`s!
 *     Ensure you return unique `Object`s/`Array`s within the `exportState()` `Object`.**
 * 
 * The `Object`'s property values *CANNOT* be of the following types:
 * - any type that isn't in the previous list, including...
 * - `function`
 * - `BigInt`
 * - `undefined` (specifically in `Array`s)
 * - `Infinity` or `NaN`
 * 
 * These restrictions are in place to ensure that the `exportState()` `Object` can be easily serialized.
 * 
 * An exception will be thrown if any of the type restrictions are not met.
 * 
 * ## Update packets
 * 
 * GameState update packets are simply `Object`s of the following format:
 * ```{ GameStateContainer property key : Object returned by exportState(), ... }```
 * 
 * A property value can be `null` in the update packet.
 * This means the property was removed from the sender's `GameStateContainer`.
 * 
 * In most cases you should use the `GameStateContainer` returned by `getContainer()`
 * when extending `ServerConnection` or `GameServer` rather than using this class directly. 
 * 
 * @example
 * class Thing {
 *   constructor() { this.x = 1; this.y = 2; this.localVar = 5; }
 *   exportState() { return { x: this.x, y: this.y } }
 *   setState(update) { this.x = update.x; this.y = update.y; }
 * }
 * 
 * // Retrieving the Container
 * let gs = myServerConnection.getGameState();
 * 
 * // Inserting an object
 * // `Thing` has exportState() and setState() defined, so this is fine!  
 * gs.myThingName = new Thing();
 * 
 * myServerConnection.update(); // sends { myThingName: { x: 1, y: 2 } }
 * 
 * // Editing local value
 * gs.myThingName.localVar = 8;
 * myServerConnection.update(); // sends nothing! exportState() didn't change
 * 
 * // Removing game state
 * gs.myThingName = undefined;
 * 
 * myServerConnection.update(); // sends { myThingName : null }
 * 
 * @class
 */
export class GameStateContainer {
    /**
     * Constructs a new `GameStateContainer`.
     * This takes a callback as an argument.
     * This callback is called whenever the user potentially modified a property in the container.
     * The callback should take one argument, a `String`, which will be the potentially changed property.
     * 
     * This constructor returns an `Array` containing:
     * ```[the GameStateContainer, the underlying Object that the container uses to store properties]```
     * 
     * @param {function} cb the property callback 
     * @returns {array} [container, object] 
     * @constructor 
     */
    constructor(cb) {
        this.mObj = {};
        this.mCb = cb;

        // the Proxy is the heart of the GameStateContainer
        // we use its handlers to track potential changes to the game state
        return [ new Proxy(this.mObj, this), this.mObj ];
    }

    /**
     * Returns a copy of the underlying `Object` that stores all game state.
     * This function does not copy class instances, it calls exportState() on all classes. 
     * @method
     * @returns {object}
     */
    capture() {
        // this function is defined in the get() handler
        console.error("GameState error: mock capture() called, this should not happen");
    }

    /**
     * Updates this `GameStateContainer` using an update packet.
     * Appropriately calls `setState(update)`.
     * This will delete properties which have been deleted in the packet
     * (deleted properties are set to `null` in update packets). 
     * @param {object} packet a GameState update packet
     * @method
     */
    apply(packet) {
        // this function is defined in the get() handler
        console.error("GameState error: mock apply() called, this should not happen");
    }

    // this is where `gs.something` is handled! we intercept the property get
    get(target, prop, receiver) {
        // real capture() definition
        if (prop === "capture") return () => {
            let obj = {};

            for (let [k, v] of Object.entries(this.mObj)) {
                if (v !== undefined) {
                    // console.log("copying prop " + k);
                    obj[k] = v.exportState();
                    validateExportedState(obj[k]);
                }
            }

            return obj;
        }

        // real apply() definition
        if (prop === "apply") return (p) => {
            if (Object.entries(p).length === 0) return;

            for (let [k, v] of Object.entries(p)) {
                if (v === null) {
                    delete this.mObj[k];
                } else {
                    validateExportedState(v); // just to be safe
                    if (this.mObj[k] !== undefined) this.mObj[k].setState(v);
                }
                this.mCb(k);
            }
        }

        // callback on this property, user might be calling function in this class which
        // could modify the state of the object
        this.mCb(prop);

        // return actual thing
        return Reflect.get(...arguments);
    }

    // where `gs.something = something` is handled
    set(target, prop, value, receiver) {
        if (prop === "capture" || prop === "apply") {
            throw "GameStateContainer error: attempted to overwrite capture() or apply()";
        }

        if (!isValidClass(value) && value !== undefined) {
            throw "GameStateContainer error: attempted to set a property to an invalid value";
        }

        this.mCb(prop);

        return Reflect.set(...arguments);
    }

    // where `delete gs.something` is handled
    deleteProperty(target, prop) {
        this.mCb(prop);
        return Reflect.deleteProperty(...arguments);
    }

    // TODO there might be more handlers that should be added
}

/**
 * Manages changes to the game state and generates update packets.
 * 
 * Also manages a `GameStateContainer`.
 * 
 * Like `GameStateContainer`, this class should not be used directly.
 * @class
 */
export class GameState {
    /**
     * Constructs a new GameState.
     * Creates a new, empty `GameStateContainer`.
     * @constructor
     */
    constructor() {
        this.mUpdateProps = [];

        // TODO sometimes the callback gets "undefined". im not sure why
        [ this.mContainer, this.mObj ] = new GameStateContainer((prop) => {
            if (prop === undefined || prop === "undefined") return;
            if (!this.mUpdateProps.includes(prop)) this.mUpdateProps.push(prop);
        });

        this.mPrevState = this.mContainer.capture();
    }

    /**
     * Returns the managed `GameStateContainer`.
     * @method
     * @returns {GameStateContainer}
     */
    getContainer() {
        return this.mContainer;
    }

    /**
     * Generates an update packet. 
     * @returns {object} an update packet
     */
    generateUpdate() {
        let curr = this.mContainer.capture();
        let prev = this.mPrevState;
        // console.log("\tprev: " + JSON.stringify(prev));
        // console.log("\tcurr: " + JSON.stringify(curr));
        // console.log(this.mUpdateProps);

        let update = {};

        for (const prop of this.mUpdateProps) {
            // prop was removed
            if (prev[prop] === undefined && curr[prop] !== undefined) {
                update[prop] = curr[prop];
            } else if (prev[prop] !== undefined && curr[prop] === undefined) {
                console.log(prop + " was deleted");
                update[prop] = null;
            } else if (hasChanged(prev[prop], curr[prop])) {
                update[prop] = curr[prop];
            } else {
                // console.log("value didn't change");
            }
        } 

        this.mUpdateProps = [];

        this.mPrevState = curr;

        // if (Object.entries(update).length !== 0) console.log("generated update: " + JSON.stringify(update));

        return deepCopy(update);
    }
}