"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const state_1 = require("../state");
class UserInterfaceAPI {
    static transferMoney(req, res) {
        const tx = new blockchain_1.Transaction(state_1.State.myWalletAddress, req.body.to, parseInt(req.body.amount));
        tx.comment = req.body.comment;
        tx.signTransaction(state_1.State.myKey);
        state_1.State.chain.addTransaction(tx);
        state_1.State.sendTransaction(tx);
        res.send("ok");
    }
    static getBalance(req, res) {
        res.send(state_1.State.chain.getBalanceOfAddress(state_1.State.myWalletAddress));
    }
}
exports.UserInterfaceAPI = UserInterfaceAPI;
//# sourceMappingURL=ui.js.map