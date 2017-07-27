import ActionType = require("./common/action-type");
import ActionCreator = require("./reducer/action-creator");
import store = require("./reducer/store");

/// <reference path="./predef.d.ts" />

App({
    onLaunch: function () {
        console.log("App Launch");
        if (!store.getState().wxUser) {
            store.dispatch(ActionCreator.fetchUser())
        }
    },
});
