"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const myKey = ec.keyFromPrivate("98d679b9bd734a39dda428bd7efa30db7e00d160aa17e12f73f03a9f9bfd6ff9");
const myWalletAddress = myKey.getPublic("hex");
class NemoCoin {
    test() {
        let chain = new blockchain_1.BlockChain();
        const tx1 = new blockchain_1.Transaction(myWalletAddress, "addr2", 10);
        tx1.signTransaction(myKey);
        chain.addTransaction(tx1);
        console.log("Start mining...");
        chain.minePendingTransactions(myWalletAddress);
        console.log("My balance is", chain.getBalanceOfAddress(myWalletAddress));
        console.log("Is valid?", chain.isChainValid());
    }
}
new NemoCoin().test();
//# sourceMappingURL=main.js.map