import {App, Component, Store} from "../../common/interface";
import State = require("../../common/entity/state");
import store = require("../../reducer/store");
import _ = require("../lodash/index");
/**
 * Created by Administrator on 2017/7/27.
 */

class WxRedux {
    static connect(component: Component, stateMapper: (state: State) => Object) {
        function go() {
            const data = stateMapper(store.getState());
            if (!_.isEqual(component.data, data)) {
                component.onUpdate && component.onUpdate(data);
                component.setData(data);
            }
        }

        go();
        store.subscribe(go);
    }
}

module.exports = WxRedux;
export = WxRedux;

