export declare class Transaction {
    from: string;
    to: string;
    amount: number;
    comment: string;
    signature: string;
    timestamp: number;
    constructor(from: string, to: string, amount: number, comment?: string);
    calculateHash(): string;
    signTransaction(signingKey: any): void;
    isValid(): boolean;
}
export declare class BlockChain {
    pendingTransactions: Transaction[];
    private chain;
    private difficulty;
    private miningReward;
    constructor();
    private createGenesisBlock;
    private getLatestBlock;
    getBlockChain(): any;
    hasTransaction(signature: string, blockLookBack: number): any;
    checkForMining(rewardAddress: string): any;
    minePendingTransactions(rewardAddress: string): void;
    addTransaction(tx: Transaction): void;
    getBalanceOfAddress(addr: string): number;
    isChainValid(): boolean;
}
