import { Response, Request } from "express";
export declare class NemoCoinAPI {
    static addTransaction(req: Request, res: Response): void;
    static nodeJoined(req: Request, res: Response): void;
    static getChain(req: Request, res: Response): any;
}
