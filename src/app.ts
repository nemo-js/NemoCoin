import { NemoCoinAPI } from "./controller/api";
import { State as State } from "./state";
import { UserInterfaceAPI } from "./controller/ui";

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');

function parseArguments(): { [key: string]: any } {
    const commandArgs = process.argv.slice(2);
    const args: { [key: string]: any } = { };
    for (let i = 0; i < commandArgs.length; i++) {
        args[commandArgs[i].trim()] = commandArgs[i + 1];
        i++;
    }

    return args;
}

function connect(port: number) {
    const app = express();

    app.set("port", port);

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // todo: get from config file
    const privateKey = "98d679b9bd734a39dda428bd7efa30db7e00d160aa17e12f73f03a9f9bfd6ff9";
    const myAddr = "http://localhost:" + port;
    State.init(privateKey, myAddr);

    app.post("/transaction/add", NemoCoinAPI.addTransaction);
    app.post("/node/new", NemoCoinAPI.nodeJoined);

    app.get("/ui/balance", UserInterfaceAPI.getBalance);
    app.post("/ui/money/transfer", UserInterfaceAPI.transferMoney);

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
}

function init() {
    const args = parseArguments();

    let port = parseInt(args["-p"]);
    if (isNaN(port)) {
        port = 3000;
    }

    connect(port);

    State.joinNetwork();
}

init();