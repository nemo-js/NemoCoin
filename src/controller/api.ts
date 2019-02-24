import { Response, Request, NextFunction } from "express";
import { BlockChain, Transaction } from "../blockchain";
import { State } from "../state";
import { MessageHeader } from "../p2p";

export class NemoCoinAPI {

    static addTransaction(req: Request, res: Response) {

        const data: Transaction = req.body.data;
        const header: MessageHeader = req.body.header;

        if (!data.signature) {
            console.log("No signature...");
            res.send("rejected");
            return;
        }

        if (State.chain.hasTransaction(data.signature, 3)) {
            console.log("Transacion already exists");
            res.send("rejected");
            return;
        }

        const tx = new Transaction(data.from, data.to, data.amount);
        tx.timestamp = data.timestamp;
        tx.signature = data.signature;
        tx.comment = data.comment;
        
        try {
            State.chain.addTransaction(tx);
            State.sendTransaction(tx, header.excludeNodes);
            res.send(tx);

            State.chain.checkForMining(State.myWalletAddress);
        } catch (e) {
            console.log(e)
            res.send("failed");
        }
    }

    static nodeJoined(req: Request, res: Response) {
        State.addNode(req.body.data.addr, req.body.header.excludeNodes);
    }

    static getChain(req: Request, res: Response): any {
        res.send(State.chain.getBlockChain());
    }

}