import { NemoCoinAPI } from "./controller/api";
import { State as State } from "./state";

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

State.init();

app.get("/", (req: any, res: any) => {
    res.send("aaa");
});

app.post("/transaction/new", NemoCoinAPI.newTransaction);

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});

const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});