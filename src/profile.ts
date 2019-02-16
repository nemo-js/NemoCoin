const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";

export class Profile {

    name: string = "";
    key: string = "";
    private static dir = __dirname + "\\.profile";

    load(name: string) {
        const path = Profile.dir + "\\" + name;
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
        if (!existsSync(Profile.dir)) {
            mkdirSync(Profile.dir);
        }

        writeFileSync(Profile.dir + "\\" + this.name, JSON.stringify({
            name: this.name,
            key: this.key
        }), { encoding: "utf8" });
    }
}