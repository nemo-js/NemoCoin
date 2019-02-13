"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./controller/api");
const state_1 = require("./state");
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
state_1.State.init();
app.get("/", (req, res) => {
    res.send("aaa");
});
app.post("/transaction/new", api_1.NemoCoinAPI.newTransaction);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});
const server = app.listen(app.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=app.js.map