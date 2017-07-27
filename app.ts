let Redux = require("./libs/redux/index");
let thunk = require("./libs/redux/redux-thunk").default;
let reducer = require("./reducer/index");
let {createStore, applyMiddleware} = Redux;

{
    let store = createStore(reducer, {}, applyMiddleware(thunk)) as Store;
    let opt = {
        onLaunch: function () {
            console.log("launch")
        },
        store: store,
    };

    App(opt);
}
