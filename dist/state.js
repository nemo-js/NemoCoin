"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
const elliptic_1 = require("elliptic");
const request_1 = __importDefault(require("request"));
const profile_1 = require("./profile");
class State {
    static init(profileName, currentWebAddr) {
        this.profile = new profile_1.Profile();
        this.profile.load(profileName);
        this.chain = new blockchain_1.BlockChain();
        this.neighbors = [];
        this.myKey = this.keyGen.keyFromPrivate(this.profile.key);
        this.myWalletAddress = this.myKey.getPublic("hex");
        this.currentWebAddr = currentWebAddr;
        this.loadStaticNeighbours();
    }
    static loadStaticNeighbours() {
        for (let i = 0; i < 1; i++) {
            const addr = "http://localhost:" + (3000 + i);
            if (addr == this.currentWebAddr) {
                continue;
            }
            this.neighbors.push(new Neighbour(addr));
        }
    }
    static joinNetwork() {
        State.postToNeighbours(100, "/node/new", { addr: State.currentWebAddr });
    }
    static addNode(addr) {
        this.neighbors = this.neighbors.filter(n => n.isDown == false);
        if (this.neighbors.find(n => n.address == addr)) {
            return;
        }
        console.log("Adding new node!", addr);
        this.neighbors.push(new Neighbour(addr));
    }
    static sendTransaction(tx1) {
        this.postToNeighbours(20, "/transaction/add", {
            from: tx1.from,
            to: tx1.to,
            amount: tx1.amount,
            comment: tx1.comment,
            signature: tx1.signature
        });
    }
    static postToNeighbours(count, path, data) {
        const upNodes = this.neighbors.filter(n => n.isDown == false);
        for (let i = 0; i < count; i++) {
            if (upNodes.length <= i) {
                console.log("no more neighbours");
                break;
            }
            const node = upNodes[i];
            if (State.currentWebAddr == node.address) {
                continue;
            }
            this.postToNeighbour(node, path, data)
                .catch(() => {
                node.isDown = true;
            });
        }
    }
    static postToNeighbour(n, path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const addr = n.address + path;
                console.log("sending to...", n.address);
                request_1.default.post(addr, { json: data }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        console.log("success to...", n.address);
                        resolve();
                    }
                    else {
                        console.log("falied to...", n.address);
                        reject();
                    }
                });
            });
        });
    }
}
State.keyGen = new elliptic_1.ec("secp256k1");
exports.State = State;
class Neighbour {
    constructor(address) {
        this.address = address;
        this.isDown = false;
    }
}
//# sourceMappingURL=state.js.map