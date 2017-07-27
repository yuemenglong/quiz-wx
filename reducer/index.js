/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */
var ActionType;
(function (ActionType) {
    ActionType[ActionType["INIT"] = 0] = "INIT";
})(ActionType || (ActionType = {}));
function reducerFn(state, action) {
    switch (action.type) {
        case ActionType.INIT:
            return state;
        default:
            return state;
    }
}
module.exports = function (state, action) {
    console.log(state, action);
    var ret = reducerFn(state, action);
    console.log(state);
    return ret;
};
