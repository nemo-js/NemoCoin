export declare class P2P {
    myAddr: string;
    private nodes;
    constructor(myAddr: string);
    addNode(addr: string, informOthers?: boolean): any;
    getNodes(): string[];
    postToNeighbours(count: number, path: string, data: any, exclude: string[]): void;
    private postToNeighbour;
}
