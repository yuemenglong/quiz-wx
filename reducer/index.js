/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */
"use strict";
var ActionType = require("../common/action-type");
function reducer(state, action) {
    console.log(state, action);
    var ret = function (state, action) {
        switch (action.type) {
            case ActionType.INIT:
                return state;
            default:
                return state;
        }
    }(state, action);
    console.log(state);
    return ret;
}
module.exports = reducer;
module.exports = reducer;
