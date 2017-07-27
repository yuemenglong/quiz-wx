/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

import ActionType = require("../common/action-type")
import {Action} from "../common/interface";

function go(state, action) {
    switch (action.type) {
        case ActionType.INIT:
            return state;
        case ActionType.FETCH_WX_USER_SUCC:
            return state;
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
