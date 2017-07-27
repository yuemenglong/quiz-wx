var Redux = require("./libs/redux/index");
var thunk = require("./libs/redux/redux-thunk").default;
var reducer = require("./reducer/index");
var createStore = Redux.createStore, applyMiddleware = Redux.applyMiddleware;
{
    var store = createStore(reducer, {}, applyMiddleware(thunk));
    var opt = {
        onLaunch: function () {
            console.log("launch");
        },
        store: store,
    };
    App(opt);
}
