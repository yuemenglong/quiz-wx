import {Component} from "../common/interface";
import State = require("../common/state/state");
import debug = require("../kit/debug");
import _ = require("../libs/lodash/index");
import reducer = require("./reducer");
/**
 * Created by yml on 2017/8/6
 */

function noop() {
}

class Store {
    reducer: Function;
    state: State;
    listeners: Function[] = [];

    constructor(reducer: Function, state: State) {
        this.reducer = reducer;
        this.state = state;
    }

    dispatch(arg: Object | Function) {
        if (typeof arg == "function") {
            arg((a) => this.dispatch(a), () => this.getState())
        } else {
            this.state = this.reducer(this.state, arg)
        }
        this.listeners.forEach(l => l())
    }

    subscribe(cb: Function): () => void {
        this.listeners = this.listeners.concat([cb]);
        return () => {
            this.listeners = this.listeners.filter(l => l != cb)
        }
    }

    getState(): State {
        return this.state;
    }

    /*----------------------------------------------------------------*/

    counter = 0;

    connect(component: any, stateMapper: (state: State) => Object) {
        component = component as Component;
        let currentGlobal = null;
        let currentData = component.data;
        let that = this;

        function go() {
            let nextGlobal = that.getState();
            if (_.isEqual(currentGlobal, nextGlobal)) {
                debug("Global Equal", nextGlobal);
                return;
            }
            currentGlobal = nextGlobal;
            let nextData = stateMapper(store.getState());
            if (_.isEqual(currentData, nextData)) {
                debug("Data Equal", nextData);
                return;
            }
            debug("Data", nextData);
            currentData = nextData;
            component.setData(currentData);
            // let data = stateMapper(store.getState());
            // debug("Data", data);
            // component.setData(data);
        }

        go();
        this.counter++;
        debug("Subscribe", this.counter);
        let unSubscribe = store.subscribe(go);
        let $onHide = (component.onHide || noop).bind(component);
        component.onHide = () => {
            this.counter--;
            debug("Unsubscribe", this.counter);
            unSubscribe();
            $onHide();
        };
        let $onUnload = (component.onUnload || noop).bind(component);
        component.onUnload = () => {
            this.counter--;
            debug("Unsubscribe", this.counter);
            unSubscribe();
            $onUnload();
        }
    }
}

let store = new Store(reducer, new State);

module.exports = store;
export = store;
