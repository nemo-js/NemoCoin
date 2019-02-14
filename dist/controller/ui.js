"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const state_1 = require("../state");
class UserInterfaceAPI {
    static addTransaction(req, res) {
        const tx1 = new blockchain_1.Transaction(state_1.State.myWalletAddress, req.body.to, parseInt(req.body.amount));
        tx1.signTransaction(state_1.State.myKey);
        state_1.State.chain.addTransaction(tx1);
        ;
        state_1.State.sendTransaction(tx1);
        res.send("ok");
    }
}
exports.UserInterfaceAPI = UserInterfaceAPI;
//# sourceMappingURL=ui.js.map