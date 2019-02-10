"use strict";
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send("aaa");
});
var server = app.listen(app.get("port"), function () {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=api.js.map