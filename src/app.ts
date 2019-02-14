import { NemoCoinAPI } from "./controller/api";
import { State as State } from "./state";
import { UserInterfaceAPI } from "./controller/ui";

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// todo: get from config file
const privateKey = "98d679b9bd734a39dda428bd7efa30db7e00d160aa17e12f73f03a9f9bfd6ff9";
State.init(privateKey);

app.post("/transaction/add", NemoCoinAPI.addTransaction);

app.post("/ui/transaction/add", UserInterfaceAPI.addTransaction);

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