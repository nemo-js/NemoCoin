import { Response, Request, NextFunction } from "express";
import { BlockChain, Transaction } from "../blockchain";
import { State } from "../state";

export class NemoCoinAPI {

    static addTransaction(req: Request, res: Response) {
        if (!req.body.signature) {
            console.log("No signature...");
            res.send("rejected");
            return;
        }

        console.log("New transaction!", req.body.signature);

        if (State.chain.hasTransaction(req.body.signature, 3)) {
            console.log("Transacion already exists");
            res.send("rejected");
            return;
        }

        const tx = new Transaction(req.body.from, req.body.to, req.body.amount);
        tx.timestamp = req.body.timestamp;
        tx.signature = req.body.signature;
        tx.comment = req.body.comment;
        
        try {
            State.chain.addTransaction(tx);
            console.log("added transaction", tx.signature);
            // todo: dont send aggain to sender
            State.sendTransaction(tx);
            res.send(tx);

            State.chain.checkForMining(State.myWalletAddress);
        } catch (e) {
            console.log(e)
            res.send("failed");
        }
    }

    static nodeJoined(req: Request, res: Response) {
        State.addNode(req.body.addr);
    }

    static getChain(req: Request, res: Response): any {
        res.send(State.chain.getBlockChain());
    }

}