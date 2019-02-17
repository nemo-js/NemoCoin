"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const state_1 = require("../state");
class NemoCoinAPI {
    static addTransaction(req, res) {
        if (!req.body.signature) {
            console.log("No signature...");
            res.send("rejected");
            return;
        }
        console.log("New transaction!", req.body.signature);
        if (state_1.State.chain.hasTransaction(req.body.signature, 3)) {
            console.log("Transacion already exists");
            res.send("rejected");
            return;
        }
        const tx = new blockchain_1.Transaction(req.body.from, req.body.to, req.body.amount);
        tx.timestamp = req.body.timestamp;
        tx.signature = req.body.signature;
        tx.comment = req.body.comment;
        try {
            state_1.State.chain.addTransaction(tx);
            console.log("added transaction", tx.signature);
            // todo: dont send aggain to sender
            state_1.State.sendTransaction(tx);
            res.send(tx);
            state_1.State.chain.checkForMining(state_1.State.myWalletAddress);
        }
        catch (e) {
            console.log(e);
            res.send("failed");
        }
    }
    static nodeJoined(req, res) {
        state_1.State.addNode(req.body.addr);
    }
    static getChain(req, res) {
        res.send(state_1.State.chain.getBlockChain());
    }
}
exports.NemoCoinAPI = NemoCoinAPI;
//# sourceMappingURL=api.js.map