"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SHA256 = require("crypto-js/sha256");
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var Transaction = /** @class */ (function () {
    function Transaction(from, to, amount, comment) {
        if (comment === void 0) { comment = ""; }
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.comment = comment;
        this.signature = "";
    }
    Transaction.prototype.calculateHash = function () {
        return SHA256(this.from + this.to + this.amount + this.comment).toString();
    };
    Transaction.prototype.signTransaction = function (signingKey) {
        if (signingKey.getPublic("hex") !== this.from) {
            throw new Error("You cannot sign transactions for other wallets!");
        }
        var hashTx = this.calculateHash();
        var sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    };
    Transaction.prototype.isValid = function () {
        if (this.from === "") {
            return true;
        }
        if (!this.signature || this.signature.length == 0) {
            return false;
        }
        var publicKey = ec.keyFromPublic(this.from, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    };
    return Transaction;
}());
exports.Transaction = Transaction;
var Block = /** @class */ (function () {
    function Block(transactions) {
        this.transactions = transactions;
        this.timestamp = -1;
        this.previousHash = "";
        this.hash = "";
        this.nonce = 0;
    }
    Block.prototype.calculateHash = function () {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    };
    Block.prototype.mineBlock = function (difficulty) {
        var target = Array(difficulty + 1).join("0");
        this.nonce = 0;
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    };
    Block.prototype.hasValidTransactions = function () {
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var tx = _a[_i];
            if (tx.isValid() === false) {
                return false;
            }
        }
        return true;
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.difficulty = 2;
        this.miningReward = 100;
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }
    BlockChain.prototype.createGenesisBlock = function () {
        var block = new Block([new Transaction("", "", 0, "Genesis block")]);
        block.timestamp = new Date().getTime();
        block.hash = block.calculateHash();
        return block;
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.minePendingTransactions = function (rewardAddress) {
        //add reward transaction
        this.pendingTransactions.push(new Transaction("", rewardAddress, this.miningReward, "Block succesfully mined"));
        var block = new Block(this.pendingTransactions);
        block.timestamp = new Date().getTime();
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        console.log("Block succesfully mined");
        this.pendingTransactions = [];
    };
    BlockChain.prototype.addTransaction = function (tx) {
        if (!tx.from || !tx.to) {
            throw new Error("Transaction should have both from and to Addresses!");
        }
        if (tx.isValid() !== true) {
            throw new Error("Cannot add invalid transaction to chain!");
        }
        this.pendingTransactions.push(tx);
    };
    BlockChain.prototype.getBalanceOfAddress = function (addr) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
                var trans = _c[_b];
                if (trans.from === addr) {
                    balance -= trans.amount;
                }
                else if (trans.to === addr) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    };
    BlockChain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var prevBlock = this.chain[i - 1];
            if (currentBlock.hasValidTransactions() !== true) {
                return false;
            }
            if (currentBlock.calculateHash() != currentBlock.hash) {
                return false;
            }
            if (currentBlock.previousHash != prevBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return BlockChain;
}());
exports.BlockChain = BlockChain;
//# sourceMappingURL=blockchain.js.map