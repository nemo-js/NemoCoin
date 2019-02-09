"use strict";
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var key = ec.genKeyPair();
var publicKey = key.getPublic("hex");
var privateKey = key.getPrivate("hex");
console.log("pub", publicKey, "priv", privateKey);
//# sourceMappingURL=keygenerator.js.map