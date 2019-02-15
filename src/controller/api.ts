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

        if (State.chain.hasTransaction(req.body.signature, 3)) {
            console.log("No signature...");
            res.send("rejected");
            return;
        }

        const tx = new Transaction(req.body.from, req.body.to, req.body.amount);
        tx.signature = req.body.signature;
        tx.comment = req.body.comment;
        
        State.chain.addTransaction(tx);

        // todo: dont send aggain to sender
        State.sendTransaction(tx);

        res.send(tx);
    }

}