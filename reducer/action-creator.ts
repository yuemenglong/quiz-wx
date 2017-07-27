import {Thunk, Dispatch, GetState} from "../common/interface";
import ActionType = require("../common/action-type");
import kit = require("../kit/kit");
/**
 * Created by Administrator on 2017/7/27.
 */

class ActionCreator {
    static fetchWxUser(): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.FETCH_WX_USER, data: null});
            kit.getUserInfo((wxUser) => {
                dispatch({type: ActionType.FETCH_WX_USER_SUCC, data: wxUser});
            })
        }
    }
}