import ActionType = require("./common/action-type");
import {Action, Store, Thunk} from "./common/interface";
let Redux = require("./libs/redux/index");
let thunk = require("./libs/redux/redux-thunk").default;
let reducer = require("./reducer/reducer");
let {createStore, applyMiddleware} = Redux;

let store = createStore(reducer, {}, applyMiddleware(thunk)) as Store;

App({
    onLaunch: function () {
        console.log("App Launch");
        if (!this.store.getState().wxUser) {

        }
    },
    dispatch: function (action: Action | Thunk) {
        this.store.dispatch(action)
    },
    store: store,
});
