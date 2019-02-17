import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
import { Profile } from "./profile";
export declare class State {
    static chain: BlockChain;
    static wallet: string;
    static profile: Profile;
    private static network;
    private static keyGen;
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;
    static init(profileName: string, currentWebAddr: string): void;
    static loadStaticNeighbours(): void;
    static getNeighbours(): any;
    static joinNetwork(): void;
    static addNode(addr: string): any;
    static sendTransaction(tx: Transaction): void;
}
