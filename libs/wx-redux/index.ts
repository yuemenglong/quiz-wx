import {Action, App, Component, Store, Thunk} from "../../common/interface";
import State = require("../../common/entity/state");
import store = require("../../reducer/store");
import _ = require("../lodash/index");
/**
 * Created by Administrator on 2017/7/27.
 */

function noop() {
}

class WxRedux {
    static connect(component: Component, stateMapper: (state: State) => Object) {
        let currentGlobal = null;
        let currentData = component.data;
        // let $setData = component.setData.bind(component);
        //
        // component.setData = function (data) {
        //     component.onUpdate && component.onUpdate(data, dispatch);
        //     $setData(data)
        // };

        function dispatch(action: Action | Thunk | Promise<any>) {
            setTimeout(() => store.dispatch(action), 0)
        }

        function go() {
            let nextGlobal = store.getState();
            if (_.isEqual(currentGlobal, nextGlobal)) {
                return;
            }
            currentGlobal = nextGlobal;
            let nextData = stateMapper(store.getState());
            if (_.isEqual(currentData, nextData)) {
                return;
            }
            console.log(nextData);
            currentData = nextData;
            component.onUpdate && component.onUpdate(currentData, dispatch);
            component.setData(currentData);
        }

        go();
        console.log("Subscribe");
        let unSubscribe = store.subscribe(go);
        let $onHide = (component.onHide || noop).bind(component);
        component.onHide = () => {
            console.log("Unsubscribe");
            unSubscribe();
            $onHide();
        };
        let $onUnload = (component.onUnload || noop).bind(component);
        component.onUnload = () => {
            console.log("Unsubscribe");
            unSubscribe();
            $onUnload();
        }
    }
}

module.exports = WxRedux;
export = WxRedux;

