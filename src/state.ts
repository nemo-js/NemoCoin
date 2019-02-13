import { BlockChain } from "./blockchain";

export class State {

    public static chain: BlockChain;
    public static neighbors: Neighbour[];
    
    static init() {
        this.chain = new BlockChain();
        this.neighbors = [];
    }
}

class Neighbour {

    constructor(public address: string) {

    }
}