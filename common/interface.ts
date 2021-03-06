import ActionType = require("./action-type");
import State = require("./state/state");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

export interface Action {
    type: ActionType,
    data: any,
}

export interface IStore {
    dispatch(action: Action | Thunk): void
    getState(): State
    subscribe(fn: () => void): () => void
}

export interface Component {
    data: Object
    setData(Object): void
    onShow(): void
    onHide(): void
    onLoad(query: Object): void
    onUnload(): void
    onUpdate(state: Object, dispatch: Dispatch): void
}

export type GetState = () => State;
export type Dispatch = (action: Action | Thunk | Promise<any>) => void;
export type Thunk = (dispatch: Dispatch, getState: GetState) => void;
