// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

// multiplayer.js: Helper functions

/**
 * Contains private helpers and constants.
 * 
 * This should not be used.
 * @private
 */
export const Messages = {
    Ping: "pi",
    Pong: "po",
    RequestFull: "f",
    Disconnect: "d",

    // Returns the given message with the special prefix
    addPrefix(message) {
        return "$" + message;
    },

    // Removes the special prefix from a given message
    // The message should have the special prefix
    // Returns the message without the prefix
    removePrefix(message) {
        return message.substring(1);
    },

    // Returns whether a message has the special prefix.
    hasPrefix(message) {
        return message[0] === "$";
    },
    
    // Used to check user messages
    // Returns the with a prefix when the message matches a system message
    // Otherwise it just returns the given message
    messageOut(message){
        if (this.checkMessage(message)) {
            return message;
        } else {
            return addPrefix(message);
        }
    },
    
    // Returns true if a message is a user message
    // Otherwise the message could be:
    // - JSON
    // - an escaped user message
    // - a system message
    checkMessage(message){
        const msgs = [ Messages.Ping, Messages.Pong, Messages.RequestFull, Messages.Disconnect ];
        for (const [_, value] of msgs) {
            if (value === message || message[0] === "$" || message[0] === "{") return false;
        }
        return true;
    },
}

// Returns a deep copy of the given object
//
// Deep copying is used primarily with exportState(),
// and exportState() should return a JSONifyable object (because of type restrictions)
// so this should be pretty reliable
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}