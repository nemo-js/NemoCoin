"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./controller/api");
const state_1 = require("./state");
const ui_1 = require("./controller/ui");
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
function parseArguments() {
    const commandArgs = process.argv.slice(2);
    const args = {};
    for (let i = 0; i < commandArgs.length; i++) {
        args[commandArgs[i].trim()] = commandArgs[i + 1];
        i++;
    }
    return args;
}
function connect(port) {
    const app = express();
    app.set("port", port);
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post("/transaction/add", api_1.NemoCoinAPI.addTransaction);
    app.post("/node/new", api_1.NemoCoinAPI.nodeJoined);
    app.get("/ui/balance", ui_1.UserInterfaceAPI.getBalance);
    app.post("/ui/money/transfer", ui_1.UserInterfaceAPI.transferMoney);
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send(err.message);
    });
    const server = app.listen(app.get("port"), () => {
        console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    });
}
function init() {
    const args = parseArguments();
    let port = parseInt(args["-p"]);
    if (isNaN(port)) {
        port = 3000;
    }
    if (args["-u"] == null) {
        console.log("Select a profile with -u argument");
        process.exit();
    }
    const myAddr = "http://localhost:" + port;
    state_1.State.init(args["-u"], myAddr);
    connect(port);
    state_1.State.joinNetwork();
}
init();
//# sourceMappingURL=app.js.map