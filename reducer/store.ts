import {Store} from "../common/interface";
let Redux = require("../libs/redux/index");
let thunk = require("../libs/redux/redux-thunk").default;
let promise = require("../libs/redux/redux-promise");
let reducer = require("reducer");
let {createStore, applyMiddleware} = Redux;
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

const store = createStore(reducer, {}, applyMiddleware(thunk, promise)) as Store;

module.exports = store;
export =store;

