"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
const elliptic_1 = require("elliptic");
const profile_1 = require("./profile");
const p2p_1 = require("./p2p");
class State {
    static init(profileName, currentWebAddr) {
        this.profile = new profile_1.Profile();
        this.profile.load(profileName);
        this.chain = new blockchain_1.BlockChain();
        this.myKey = this.keyGen.keyFromPrivate(this.profile.key);
        this.myWalletAddress = this.myKey.getPublic("hex");
        this.currentWebAddr = currentWebAddr;
        this.network = new p2p_1.P2P(currentWebAddr);
        this.loadStaticNeighbours();
    }
    static loadStaticNeighbours() {
        for (let i = 0; i < 1; i++) {
            const addr = "http://localhost:" + (3000 + i);
            if (addr == this.currentWebAddr) {
                continue;
            }
            this.network.addNode(addr, false);
        }
    }
    static getNeighbours() {
        return State.network.getNodes();
    }
    static joinNetwork() {
        State.network.postToNeighbours(100, "/node/new", { addr: State.currentWebAddr }, []);
    }
    static addNode(addr) {
        this.network.addNode(addr);
    }
    static sendTransaction(tx) {
        this.network.postToNeighbours(20, "/transaction/add", {
            from: tx.from,
            to: tx.to,
            amount: tx.amount,
            comment: tx.comment,
            signature: tx.signature,
            timestamp: tx.timestamp
        }, []);
    }
}
State.keyGen = new elliptic_1.ec("secp256k1");
exports.State = State;
//# sourceMappingURL=state.js.map