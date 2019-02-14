import { BlockChain, Transaction } from "./blockchain";
import { ec } from "elliptic";
export declare class State {
    static chain: BlockChain;
    static neighbors: Neighbour[];
    static wallet: string;
    private static keyGen;
    static myKey: ec.KeyPair;
    static myWalletAddress: string;
    static init(privateKey: string): void;
    static sendTransaction(tx1: Transaction): void;
    private static postToNeighbours;
    private static postToNeighbour;
}
declare class Neighbour {
    address: string;
    constructor(address: string);
}
export {};
