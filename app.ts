import ActionType = require("./common/action-type");
import Store = require("./common/store");
let Redux = require("./libs/redux/index");
let thunk = require("./libs/redux/redux-thunk").default;
let reducer = require("./reducer/index");
let {createStore, applyMiddleware} = Redux;

let store = createStore(reducer, {}, applyMiddleware(thunk)) as Store;

App({
    onLaunch: function () {
        console.log("App Launch")
    },
    dispatch: function (type: ActionType, data: any) {
        if (typeof(type) == "function") {
            this.store.dispatch(type)
        } else {
            this.store.dispatch({type: type, data: data})
        }
    },
    store: store,
});
