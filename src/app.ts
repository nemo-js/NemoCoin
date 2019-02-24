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

function connect(user: string, port: number) {
    const app = express();

    app.set("port", port);

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post("/transaction/add", NemoCoinAPI.addTransaction);
    app.post("/node/new", NemoCoinAPI.nodeJoined);
    app.get("/chain", NemoCoinAPI.getChain);

    app.get("/ui/balance", UserInterfaceAPI.getBalance);
    app.get("/ui/address", UserInterfaceAPI.getAddress);
    app.get("/ui/neighbours", UserInterfaceAPI.getNeighbours);
    app.post("/ui/money/transfer", UserInterfaceAPI.transferMoney);

    app.use((err: any, req: any, res: any, next: any) => {
        console.error(err.stack);
        res.status(500).send(err.message);
    });

    app.listen(app.get("port"), () => {
        console.log("  App is running at http://localhost:%d in %s mode. User %s",
            app.get("port"),
            app.get("env"),
            user
        );
    });
}

function init() {
    const args = parseArguments();

    let port = parseInt(args["-p"]);
    if (isNaN(port)) {
        port = 3000;
    }

    const user = args["-u"];

    if (user == null) {
        console.log("Select a profile with -u argument");
        process.exit();
    }

    const myAddr = "http://localhost:" + port;
    State.init(user, myAddr);

    connect(user, port);

    State.joinNetwork();
}

init();