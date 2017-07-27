import ActionType = require("./common/action-type");
import {Action, Store, Thunk} from "./common/interface";
import ActionCreator = require("./reducer/action-creator");
let Redux = require("./libs/redux/index");
let thunk = require("./libs/redux/redux-thunk").default;
let reducer = require("./reducer/reducer");
let {createStore, applyMiddleware} = Redux;

let store = createStore(reducer, {}, applyMiddleware(thunk)) as Store;

App({
    onLaunch: function () {
        console.log("App Launch");
        if (!this.store.getState().wxUser) {
            this.dispatch(ActionCreator.fetchWxUser())
        }
    },
    dispatch: function (action: Action | Thunk) {
        this.store.dispatch(action)
    },
    store: store,
});
