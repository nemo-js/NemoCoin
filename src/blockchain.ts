var SHA256: any = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

export class Transaction {
    
    public signature: string = "";
    public timestamp: number = 0;

    constructor(public from: string, public to: string, public amount: number, public comment: string = "") {
        this.timestamp = new Date().getTime();
    }

    calculateHash(): string {
        return SHA256(this.from + this.to + this.amount + this.comment + this.timestamp).toString();
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

export class Block {

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
    private miningReward = this.difficulty * 10;
    private eventListeners: { [event: string]: Function[] } = {};

    constructor(blocks: Block[]) {
        this.chain = blocks == null || blocks.length == 0 
            ? [this.createGenesisBlock()]
            : blocks;
        this.pendingTransactions = [];
        this.eventListeners = {
            "mined": []
        };
    }

    public on(eventName: string, listener: Function) {
        if (eventName != "mined") {
            throw new Error("Uknown event " + eventName);
        }

        this.eventListeners[eventName].push(listener);
    }

    private raiseEvent(eventName: string, args: any[]) {
        if (this.eventListeners[eventName] == null) {
            return;
        }

        const listeners = this.eventListeners[eventName];
        for (const listener of listeners) {
            listener(args);
        }
    }

    private createGenesisBlock(): Block {
        console.log("Generating Genesis Block...")
        const block = new Block([
            new Transaction("", "", 0, "Genesis block"),
            new Transaction("", "0486977bee867870adc99d9801bcefe1cd874891091d3cc352a37848ce778aaee60a57b5e99d760ffc2b96521614149524a792e4a882e7752bd3d2237d7f562aa7", 100, "Genesis block"),
        ]);
        block.timestamp = -1;
        block.hash = block.calculateHash();
        return block;
    }

    private getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    getBlockChain(): any {
        return JSON.parse(JSON.stringify(this.chain));
    }

    hasTransaction(signature: string, blockLookBack: number): any {
        if (this.pendingTransactions.find(t => t.signature == signature) != null) {
            return true;
        }

        for (let i = this.chain.length - 1; i >= 0 && i > this.chain.length - blockLookBack; i--) {
            const block = this.chain[i];
            if (block.transactions.find(t => t.signature == signature) != null) {
                return true;
            }
        }

        return false;
    }

    checkForMining(rewardAddress: string): any {
        if (this.pendingTransactions.length < 1) {
            return;
        }

        this.minePendingTransactions(rewardAddress);
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

        this.raiseEvent("mined", [block]);
    }

    addTransaction(tx: Transaction) {
        if (!tx.from || !tx.to) {
            throw new Error("Transaction should have both from and to Addresses!");
        }

        if (tx.isValid() !== true) {
            throw new Error("Cannot add invalid transaction to chain!");
        }

        this.pendingTransactions.push(tx);
        console.log("Added transaction!", tx.signature);
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
