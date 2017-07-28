import {App, Component, Store} from "../../common/interface";
import State = require("../../common/entity/state");
import store = require("../../reducer/store");
import _ = require("../lodash/index");
/**
 * Created by Administrator on 2017/7/27.
 */

class WxRedux {
    static connect(component: Component, stateMapper: (state: State) => Object) {
        let currentData = component.data;

        function go() {
            let nextData = stateMapper(store.getState());
            if (!_.isEqual(currentData, nextData)) {
                currentData = nextData;
                component.onUpdate && component.onUpdate(currentData);
                component.setData(currentData);
            }
        }

        go();
        store.subscribe(go);
    }
}

module.exports = WxRedux;
export = WxRedux;

