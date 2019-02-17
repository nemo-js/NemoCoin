"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const fs_1 = require("fs");
class Profile {
    constructor() {
        this.name = "";
        this.key = "";
        if (!fs_1.existsSync(Profile.dir)) {
            fs_1.mkdirSync(Profile.dir);
        }
    }
    load(name) {
        const path = this.getProfilePath(name);
        if (!fs_1.existsSync(path)) {
            this.create(name);
            return;
        }
        const data = JSON.parse(fs_1.readFileSync(path, "utf8"));
        this.name = data.name;
        this.key = data.key;
    }
    create(name) {
        const key = ec.genKeyPair();
        this.name = name;
        this.key = key.getPrivate("hex");
        this.save();
    }
    save() {
        if (!fs_1.existsSync(Profile.dir + "\\" + this.name)) {
            fs_1.mkdirSync(Profile.dir + "\\" + this.name);
        }
        fs_1.writeFileSync(this.getProfilePath(this.name), JSON.stringify({
            name: this.name,
            key: this.key
        }), { encoding: "utf8" });
    }
    getProfilePath(name) {
        return Profile.dir + "\\" + name + "\\profile";
    }
}
Profile.dir = __dirname + "\\.profile";
exports.Profile = Profile;
//# sourceMappingURL=profile.js.map