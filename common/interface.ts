import ActionType = require("./action-type");
import State = require("./entity/state");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

export interface Action {
    type: ActionType,
    data: any,
}

export interface App {
    dispatch(action: Action | Thunk): void
    store: Store
}

export interface Store {
    dispatch(action: Action | Thunk | Promise<any>): void
    getState(): State
    subscribe(fn: () => void): () => void
}

export interface Component {
    data: Object
    setData(Object): void
    onUpdate(state: Object, dispatch: Dispatch): void
}

export type GetState = () => State;
export type Dispatch = (action: Action | Thunk | Promise<any>) => void;
export type Thunk = (dispatch: Dispatch, getState: GetState) => void;
