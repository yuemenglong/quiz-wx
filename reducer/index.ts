/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

interface Store {
    getState(): any
    dispatch(action: Action): void
    subscribe(fn: Function): Function
}

enum ActionType{
    "INIT"
}

interface Action {
    type: ActionType,
    data: any,
}

function reducerFn(state: Object, action: Action): Object{
    switch (action.type) {
        case ActionType.INIT:
            return state;
        default:
            return state;
    }
}
module.exports = function (state: Object, action: Action): Object{
    console.log(state, action);
    let ret = reducerFn(state, action);
    console.log(state);
    return ret
};
