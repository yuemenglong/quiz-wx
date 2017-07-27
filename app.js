"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("./libs/redux/index");
var thunk = require("./libs/redux/redux-thunk").default;
var reducer = require("./reducer/index");
var createStore = Redux.createStore, applyMiddleware = Redux.applyMiddleware;
var store = createStore(reducer, {}, applyMiddleware(thunk));
App({
    onLaunch: function () {
        console.log("App Launch");
    },
    dispatch: function (type, data) {
        if (typeof (type) == "function") {
            this.store.dispatch(type);
        }
        else {
            this.store.dispatch({ type: type, data: data });
        }
    },
    store: store,
});
