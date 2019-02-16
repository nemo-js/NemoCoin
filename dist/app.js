"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./controller/api");
const state_1 = require("./state");
const ui_1 = require("./controller/ui");
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
const commandArgs = process.argv.slice(2);
const args = {};
for (let i = 0; i < commandArgs.length; i++) {
    args[commandArgs[i].trim()] = commandArgs[i + 1];
    i++;
}
const app = express();
let port = parseInt(args["-p"]);
if (isNaN(port)) {
    port = 3000;
}
app.set("port", port);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// todo: get from config file
const privateKey = "98d679b9bd734a39dda428bd7efa30db7e00d160aa17e12f73f03a9f9bfd6ff9";
const myAddr = "http://localhost:" + port;
state_1.State.init(privateKey, myAddr);
app.post("/transaction/add", api_1.NemoCoinAPI.addTransaction);
app.get("/ui/getBalance", ui_1.UserInterfaceAPI.getBalance);
app.post("/ui/money/transfer", ui_1.UserInterfaceAPI.transferMoney);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});
const server = app.listen(app.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=app.js.map