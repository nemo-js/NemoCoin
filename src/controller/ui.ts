import { Response, Request, NextFunction } from "express";
import { BlockChain, Transaction } from "../blockchain";
import { State } from "../state";

export class UserInterfaceAPI {

    static addTransaction(req: Request, res: Response) {
        const tx1 = new Transaction(State.myWalletAddress, req.body.to, parseInt(req.body.amount));
        tx1.signTransaction(State.myKey);
        State.chain.addTransaction(tx1);;

        State.sendTransaction(tx1);

        res.send("ok");
    }

}