import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
import { Profile } from "./profile";
import { P2P } from "./p2p";

export class State {

    public static chain: BlockChain;
    public static wallet: string;
    public static profile: Profile;

    private static network: P2P;
    private static keyGen = new ec("secp256k1");
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;

    static init(profileName: string, currentWebAddr: string) {
        this.profile = new Profile();
        this.profile.load(profileName);
        this.chain = new BlockChain();
        this.myKey = this.keyGen.keyFromPrivate(this.profile.key);
        this.myWalletAddress = this.myKey.getPublic("hex");
        this.currentWebAddr = currentWebAddr;
        this.network = new P2P(currentWebAddr);
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

    static getNeighbours(): any {
        return State.network.getNodes();
    }

    static joinNetwork() {
        State.network.postToNeighbours(100, "/node/new", { addr: State.currentWebAddr }, []);
    }

    static addNode(addr: string): any {
        this.network.addNode(addr);
    }

    static sendTransaction(tx: Transaction): void {
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