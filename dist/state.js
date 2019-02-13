"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
class State {
    static init() {
        this.chain = new blockchain_1.BlockChain();
        this.neighbors = [];
    }
}
exports.State = State;
class Neighbour {
    constructor(address) {
        this.address = address;
    }
}
//# sourceMappingURL=state.js.map