import { Response, Request, NextFunction } from "express";
import { BlockChain, Transaction } from "../blockchain";
import { State } from "../state";

export class NemoCoinAPI {

    static newTransaction(req: Request, res: Response) {
        const tx = new Transaction(req.body.from, req.body.to, req.body.amount);
        tx.signature = req.body.signature;
        tx.comment = req.body.comment;
        
        State.chain.addTransaction(tx);

        res.send(tx);
    }

}