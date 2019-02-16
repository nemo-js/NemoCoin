import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
export declare class State {
    static chain: BlockChain;
    static neighbors: Neighbour[];
    static wallet: string;
    private static keyGen;
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static currentWebAddr: string;
    static init(privateKey: string, currentWebAddr: string): void;
    static loadStaticNeighbours(): void;
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
