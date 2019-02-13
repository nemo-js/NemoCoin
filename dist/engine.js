"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
class State {
    static init() {
        this.chain = new blockchain_1.BlockChain();
    }
}
exports.State = State;
//# sourceMappingURL=engine.js.map