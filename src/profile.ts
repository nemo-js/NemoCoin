const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { Block } from "./blockchain";

export class Profile {

    name: string = "";
    key: string = "";
    private static dir = __dirname + "\\.profile";

    constructor() {
        if (!existsSync(Profile.dir)) {
            mkdirSync(Profile.dir);
        }
    }
    
    load(name: string) {
        const path = this.getProfilePath(name);
        if (!existsSync(path)) {
            this.create(name);
            return;
        }

        const data = JSON.parse(readFileSync(path, "utf8"));
        this.name = data.name;
        this.key = data.key;
    }

    create(name: string) {
        const key = ec.genKeyPair();
        this.name = name;
        this.key = key.getPrivate("hex");
        this.save();
    }

    save() {
        if (!existsSync(Profile.dir + "\\" + this.name)) {
            mkdirSync(Profile.dir + "\\" + this.name);
        }

        writeFileSync(this.getProfilePath(this.name), JSON.stringify({
            name: this.name,
            key: this.key
        }), { encoding: "utf8" });
    }

    getBlockchain(): Block[] {
        const path = this.getBlockchainPath();
        if (!existsSync(path)) {
            return [];
        }

        return JSON.parse(readFileSync(path, "utf8")) as Block[];
    }

    saveBlockChain(chain: Block[]) {
        writeFileSync(this.getBlockchainPath(), JSON.stringify(chain, null, 4), { encoding: "utf8" });
    }

    private getProfilePath(name: string): string {
        return Profile.dir + "\\" + name + "\\profile";
    }

    private getBlockchainPath(): string {
        return Profile.dir + "\\" + this.name + "\\blockchain";
    }
}