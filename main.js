const override = require("./scripts/override");
override.apply();

const app = require("./scripts/app");
app.init();

const updater = require("./scripts/updater");
updater.check();