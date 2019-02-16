import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
import request from "request";
import { Profile } from "./profile";

export class State {
    public static chain: BlockChain;
    public static neighbors: Neighbour[];
    public static wallet: string;
    public static profile: Profile;

    private static keyGen = new ec("secp256k1");
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;

    static init(profileName: string, currentWebAddr: string) {
        this.profile = new Profile();
        this.profile.load(profileName);
        this.chain = new BlockChain();
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
        State.postToNeighbours(100, "/node/new", { addr: State.currentWebAddr })
    }

    static addNode(addr: string): any {
        this.neighbors = this.neighbors.filter(n => n.isDown == false);
        if (this.neighbors.find(n => n.address == addr)) {
            return;
        }
        console.log("Adding new node!", addr);
        this.neighbors.push(new Neighbour(addr));
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

    private static async postToNeighbour(n: Neighbour, path: string, data: any) {
        return new Promise(function(resolve, reject){
            const addr = n.address + path;
            console.log("sending to...",  n.address);
            request.post(addr, { json: data }, 
                (error: any, response: request.Response, body: any) => {
                    if (!error && response.statusCode == 200) {
                        console.log("success to...",  n.address);
                        resolve();
                    } else {
                        console.log("falied to...",  n.address);
                        reject();
                    }
            });
        });
    }
}

class Neighbour {

    public isDown = false;

    constructor(public address: string) {

    }
}