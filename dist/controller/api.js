"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const state_1 = require("../state");
class NemoCoinAPI {
    static newTransaction(req, res) {
        const tx = new blockchain_1.Transaction(req.body.from, req.body.to, req.body.amount);
        tx.signature = req.body.signature;
        tx.comment = req.body.comment;
        state_1.State.chain.addTransaction(tx);
        res.send(tx);
    }
}
exports.NemoCoinAPI = NemoCoinAPI;
//# sourceMappingURL=api.js.map