import { Response, Request, NextFunction } from "express";
import { Transaction } from "../blockchain";
import { State } from "../state";

export class UserInterfaceAPI {

    static transferMoney(req: Request, res: Response) {
        const transferAmount = parseInt(req.body.amount);
        if (transferAmount > State.chain.getBalanceOfAddress(State.myWalletAddress)) {
            throw new Error("Not enough balance to complete transaction");
        }
        const tx = new Transaction(State.myWalletAddress, req.body.to, transferAmount);
        tx.comment = req.body.comment;
        tx.signTransaction(State.myKey);
        State.chain.addTransaction(tx);

        State.sendTransaction(tx, []);

        res.send("ok");
    }

    static getBalance(req: Request, res: Response) {
        res.send({ balance: State.chain.getBalanceOfAddress(State.myWalletAddress) });
    }

    static getAddress(req: Request, res: Response) {
        res.send({ address: State.myWalletAddress });
    }

    static getNeighbours(req: Request, res: Response) {
        res.send(State.getNeighbours());
    }

}