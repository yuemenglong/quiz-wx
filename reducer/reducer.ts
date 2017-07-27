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
            let wxUser = action.data;
            return _.defaults({wxUser}, state);
        case ActionType.FETCH_USER_SUCC:
            let user = action.data;
            return _.defaults({user}, state);
        case ActionType.REGIST_USER_SUCC:
            user = action.data;
            return _.defaults({user}, action.data);
        default:
            return state;
    }
}

function reducer(state: Object, action: Action): Object {
    console.log(state, action);
    let ret = go(state, action);
    console.log(ret);
    return ret
}


module.exports = reducer;
export =reducer;
