/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

import ActionType = require("../common/action-type")
import Action = require("../common/action.js");

function reducer(state: Object, action: Action): Object {
    console.log(state, action);
    let ret = function (state, action) {
        switch (action.type) {
            case ActionType.INIT:
                return state;
            default:
                return state;
        }
    }(state, action)
    console.log(state);
    return ret
}


module.exports = reducer;
export =reducer;
