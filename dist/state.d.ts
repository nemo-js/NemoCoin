import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
import { Profile } from "./profile";
export declare class State {
    static chain: BlockChain;
    static neighbors: Neighbour[];
    static wallet: string;
    static profile: Profile;
    private static keyGen;
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;
    static init(profileName: string, currentWebAddr: string): void;
    static loadStaticNeighbours(): void;
    static joinNetwork(): void;
    static addNode(addr: string): any;
    static sendTransaction(tx1: Transaction): void;
    private static postToNeighbours;
    private static postToNeighbour;
}
declare class Neighbour {
    address: string;
    isDown: boolean;
    constructor(address: string);
}
export {};
