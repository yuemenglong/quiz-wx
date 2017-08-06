import {Component} from "../../common/interface";
import State = require("../../common/state/state");
import store = require("../../reducer/store");
import _ = require("../lodash/index");
import debug = require("../../kit/debug");
/**
 * Created by Administrator on 2017/7/27.
 */

function noop() {
}

class WxRedux {
    static counter = 0;

    static connect(component: any, stateMapper: (state: State) => Object) {
        component = component as Component;
        let currentGlobal = null;
        let currentData = component.data;

        function go() {
            let nextGlobal = store.getState();
            if (_.isEqual(currentGlobal, nextGlobal)) {
                debug("Global Equal");
                return;
            }
            currentGlobal = nextGlobal;
            let nextData = stateMapper(store.getState());
            if (_.isEqual(currentData, nextData)) {
                debug("Data Equal");
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
        WxRedux.counter++;
        debug("Subscribe", WxRedux.counter);
        let unSubscribe = store.subscribe(go);
        let $onHide = (component.onHide || noop).bind(component);
        component.onHide = () => {
            WxRedux.counter--;
            debug("Unsubscribe", WxRedux.counter);
            unSubscribe();
            $onHide();
        };
        let $onUnload = (component.onUnload || noop).bind(component);
        component.onUnload = () => {
            WxRedux.counter--;
            debug("Unsubscribe", WxRedux.counter);
            unSubscribe();
            $onUnload();
        }
    }
}

module.exports = WxRedux;
export = WxRedux;

