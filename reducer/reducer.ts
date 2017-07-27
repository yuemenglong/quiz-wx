/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

import ActionType = require("../common/action-type")
import {Action} from "../common/interface";
import WxUser = require("../common/entity/wx-user");
import _ = require("../libs/lodash/index");


function go(state, action) {
    switch (action.type) {
        case ActionType.INIT:
            return state;
        case ActionType.FETCH_WX_USER_SUCC:
            let wxUser = action.data as WxUser;
            return _.defaults({wxUser}, state);
        default:
            return state;
    }
}

function reducer(state: Object, action: Action): Object {
    console.log(state, action);
    let ret = go(state, action);
    console.log(state);
    return ret
}


module.exports = reducer;
export =reducer;
