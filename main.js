var SHA256 = require("crypto-js/sha256");
var Block = /** @class */ (function () {
    function Block(index, timestamp, data, previusHash) {
        if (previusHash === void 0) { previusHash = null; }
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previusHash = previusHash;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return SHA256(this.index + this.previusHash + this.timestamp + JSON.stringify(this.data)).toString();
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [this.createGenesisBlock()];
    }
    BlockChain.prototype.createGenesisBlock = function () {
        return new Block(0, "01/01/2010", "Genesis Block", "0");
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.addBlock = function (newBlock) {
        newBlock.previusHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    };
    BlockChain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var prevBlock = this.chain[i - 1];
            if (currentBlock.calculateHash() != currentBlock.hash) {
                return false;
            }
            if (currentBlock.previusHash != prevBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return BlockChain;
}());
var zcoin = new BlockChain();
zcoin.addBlock(new Block(1, "02/01/2019", { ammount: 100, from: "3567ad23fe", to: "4373cd23de", comment: "elastika" }));
zcoin.addBlock(new Block(2, "04/01/2019", { ammount: 100, from: "4373cd23de", to: "3567ad23fe", comment: "epistorfi" }));
console.log("valid?", zcoin.isChainValid());
