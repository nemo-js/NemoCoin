import { Response, Request, NextFunction } from "express";
import { BlockChain, Transaction } from "../blockchain";
import { State } from "../state";

export class UserInterfaceAPI {

    static transferMoney(req: Request, res: Response) {
        const tx = new Transaction(State.myWalletAddress, req.body.to, parseInt(req.body.amount));
        tx.comment = req.body.comment;
        tx.signTransaction(State.myKey);
        State.chain.addTransaction(tx);

        State.sendTransaction(tx);

        res.send("ok");
    }

    static getBalance(req: Request, res: Response) {
        res.send(State.chain.getBalanceOfAddress(State.myWalletAddress));
    }

}