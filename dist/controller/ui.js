"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const state_1 = require("../state");
class UserInterfaceAPI {
    static transferMoney(req, res) {
        const transferAmount = parseInt(req.body.amount);
        if (transferAmount > state_1.State.chain.getBalanceOfAddress(state_1.State.myWalletAddress)) {
            throw new Error("Not enough balance to complete transaction");
        }
        const tx = new blockchain_1.Transaction(state_1.State.myWalletAddress, req.body.to, transferAmount);
        tx.comment = req.body.comment;
        tx.signTransaction(state_1.State.myKey);
        state_1.State.chain.addTransaction(tx);
        state_1.State.sendTransaction(tx);
        res.send("ok");
    }
    static getBalance(req, res) {
        res.send({ balance: state_1.State.chain.getBalanceOfAddress(state_1.State.myWalletAddress) });
    }
    static getAddress(req, res) {
        res.send({ address: state_1.State.myWalletAddress });
    }
    static getNeighbours(req, res) {
        res.send(state_1.State.getNeighbours());
    }
}
exports.UserInterfaceAPI = UserInterfaceAPI;
//# sourceMappingURL=ui.js.map