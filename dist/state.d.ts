import { BlockChain } from "./blockchain";
export declare class State {
    static chain: BlockChain;
    static neighbors: Neighbour[];
    static init(): void;
}
declare class Neighbour {
    address: string;
    constructor(address: string);
}
export {};
