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
//const EC = require("elliptic").ec;
//const ec = new EC("secp256k1");
class State {
    static init(privateKey) {
        this.chain = new blockchain_1.BlockChain();
        this.neighbors = [];
        this.myKey = this.keyGen.keyFromPrivate(privateKey);
        this.myWalletAddress = this.myKey.getPublic("hex");
    }
    static sendTransaction(tx1) {
        this.postToNeighbours(20, "/api/add", {
            from: tx1.from,
            to: tx1.to,
            amount: tx1.amount,
            comment: tx1.comment,
            signature: tx1.signature
        });
    }
    static postToNeighbours(count, path, data) {
        for (let i = 0; i < count; i++) {
            if (this.neighbors.length <= i) {
                console.log("no more neighbours: " + path);
                break;
            }
            this.postToNeighbour(this.neighbors[i], path, data);
        }
    }
    static postToNeighbour(n, path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const addr = n.address + "/" + path;
                request_1.default.post(addr, { json: data }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        resolve();
                    }
                    else {
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
    }
}
//# sourceMappingURL=state.js.map