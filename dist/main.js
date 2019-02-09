"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blockchain_1 = require("./blockchain");
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var myKey = ec.keyFromPrivate("98d679b9bd734a39dda428bd7efa30db7e00d160aa17e12f73f03a9f9bfd6ff9");
var myWalletAddress = myKey.getPublic("hex");
var NemoCoin = /** @class */ (function () {
    function NemoCoin() {
    }
    NemoCoin.prototype.test = function () {
        var chain = new blockchain_1.BlockChain();
        var tx1 = new blockchain_1.Transaction(myWalletAddress, "addr2", 10);
        tx1.signTransaction(myKey);
        chain.addTransaction(tx1);
        console.log("Start mining...");
        chain.minePendingTransactions(myWalletAddress);
        console.log("My balance is", chain.getBalanceOfAddress(myWalletAddress));
        console.log("Is valid?", chain.isChainValid());
    };
    return NemoCoin;
}());
new NemoCoin().test();
//# sourceMappingURL=main.js.map