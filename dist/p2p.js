"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
// todo: make p2p network more clever (on broadcast skip already informed, dont remove nodes on first failure)
class P2P {
    constructor(myAddr) {
        this.myAddr = myAddr;
        this.nodes = [];
    }
    addNode(addr, informOthers = true) {
        this.nodes = this.nodes.filter(n => n.isDown == false);
        if (addr == this.myAddr) {
            return;
        }
        if (this.nodes.length > 25) {
            return;
        }
        if (this.nodes.find(n => n.address == addr)) {
            return;
        }
        console.log("Adding new node!", addr);
        this.nodes.push(new Neighbour(addr));
        if (informOthers === true) {
            this.postToNeighbours(100, "/node/new", { addr: addr }, []);
        }
    }
    getNodes() {
        return this.nodes.map(n => n.address);
    }
    postToNeighbours(count, path, data, exclude) {
        const upNodes = this.nodes.filter(n => n.isDown == false);
        for (let i = 0; i < count; i++) {
            if (upNodes.length <= i) {
                break;
            }
            const node = upNodes[i];
            if (this.myAddr == node.address) {
                continue;
            }
            if (exclude != null && exclude.indexOf(node.address) > -1) {
                continue;
            }
            this.postToNeighbour(node, path, data)
                .catch(() => {
                node.isDown = true;
            });
        }
    }
    postToNeighbour(n, path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const addr = n.address + path;
                request_1.default.post(addr, { json: data }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        console.log("success to...", n.address);
                        resolve();
                    }
                    else {
                        console.log("falied to...", n.address);
                        reject();
                    }
                });
            });
        });
    }
}
exports.P2P = P2P;
class Neighbour {
    constructor(address) {
        this.address = address;
        this.isDown = false;
    }
}
//# sourceMappingURL=p2p.js.map