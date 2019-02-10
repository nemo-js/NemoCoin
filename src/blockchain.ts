var SHA256: any = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

export class Transaction {
    
    public signature: string = "";

    constructor(public from: string, public to: string, public amount: number, public comment: string = "") {

    }

    calculateHash(): string {
        return SHA256(this.from + this.to + this.amount + this.comment).toString();
    }

    signTransaction(signingKey: any): void {
        if (signingKey.getPublic("hex") !== this.from) {
            throw new Error("You cannot sign transactions for other wallets!");
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid(): boolean {
        if (this.from === "") {
            return true;
        }

        if (!this.signature || this.signature.length == 0) {
            return false;
        }

        const publicKey = ec.keyFromPublic(this.from, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {

    public hash: string;
    public timestamp: number;
    public previousHash: string;
    private nonce: number;

    constructor(public transactions: Transaction[]) {
        this.timestamp = -1;
        this.previousHash = "";
        this.hash = "";
        this.nonce = 0;
    }

    public calculateHash(): string {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    public mineBlock(difficulty: number): void {
        const target = Array(difficulty + 1).join("0");
        this.nonce = 0;
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (tx.isValid() === false) {
                return false;
            }
        }

        return true;
    }
}

export class BlockChain {

    pendingTransactions: Transaction[];
    private chain: Block[];
    private difficulty = 2;
    private miningReward = 100;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }

    private createGenesisBlock(): Block {
        const block = new Block([new Transaction("", "", 0, "Genesis block")]);
        block.timestamp = new Date().getTime();
        block.hash = block.calculateHash();
        return block;
    }

    private getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(rewardAddress: string) {
        //add reward transaction
        this.pendingTransactions.push(new Transaction("", rewardAddress, this.miningReward, "Block succesfully mined"));

        const block = new Block(this.pendingTransactions);
        block.timestamp = new Date().getTime();
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        console.log("Block succesfully mined");

        this.pendingTransactions = [];
    }

    addTransaction(tx: Transaction) {
        if (!tx.from || !tx.to) {
            throw new Error("Transaction should have both from and to Addresses!");
        }

        if (tx.isValid() !== true) {
            throw new Error("Cannot add invalid transaction to chain!");
        }

        this.pendingTransactions.push(tx);
    }

    getBalanceOfAddress(addr: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.from === addr) {
                    balance -= trans.amount;
                } else if (trans.to === addr) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i -1];

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
    }
}
