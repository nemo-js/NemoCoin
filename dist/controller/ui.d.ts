import { Response, Request } from "express";
export declare class UserInterfaceAPI {
    static transferMoney(req: Request, res: Response): void;
    static getBalance(req: Request, res: Response): void;
    static getAddress(req: Request, res: Response): void;
    static getNeighbours(req: Request, res: Response): void;
}
