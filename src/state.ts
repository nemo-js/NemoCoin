import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
import request from "request";

//const EC = require("elliptic").ec;
//const ec = new EC("secp256k1");
export class State {
    public static chain: BlockChain;
    public static neighbors: Neighbour[];
    public static wallet: string;

    private static keyGen = new ec("secp256k1");
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;

    static init(privateKey: string, currentWebAddr: string) {
        this.chain = new BlockChain();
        this.neighbors = [];
        this.myKey = this.keyGen.keyFromPrivate(privateKey);
        this.myWalletAddress = this.myKey.getPublic("hex");
        this.currentWebAddr = currentWebAddr;
        this.loadStaticNeighbours();
    }

    static loadStaticNeighbours() {
        for (let i = 0; i < 4; i++) {
            const addr = "http://localhost:" + (3000 + i);
            if (addr == this.currentWebAddr) {
                continue;
            }
            this.neighbors.push(new Neighbour(addr));
        }
    }

    static sendTransaction(tx1: Transaction): void {
        this.postToNeighbours(20, "/transaction/add", {
            from: tx1.from,
            to: tx1.to,
            amount: tx1.amount,
            comment: tx1.comment,
            signature: tx1.signature
        });
    }

    private static postToNeighbours(count: number, path: string, data: any) {
        for (let i = 0; i < count; i++) {
            if (this.neighbors.length <= i) {
                console.log("no more neighbours: " + path);
                break;
            }
            
            this.postToNeighbour(this.neighbors[i], path, data);
        }
    }

    private static async postToNeighbour(n: Neighbour, path: string, data: any) {
        return new Promise(function(resolve, reject){
            const addr = n.address + path;
            console.log("sending to...",  addr);
            request.post(addr, { json: data }, 
                (error: any, response: request.Response, body: any) => {
                    if (!error && response.statusCode == 200) {
                        resolve();
                        console.log("success to...",  addr);
                    } else {
                        reject();
                        console.log("falied to...",  addr);
                    }
            });
        });
    }
}

class Neighbour {

    constructor(public address: string) {

    }
}