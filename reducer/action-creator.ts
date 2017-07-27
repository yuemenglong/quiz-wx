import {Thunk, Dispatch, GetState} from "../common/interface";
import ActionType = require("../common/action-type");
import kit = require("../kit/kit");
import http = require("../kit/http");
import WxUser = require("../common/entity/wx-user");
import User = require("../common/entity/user");
/**
 * Created by Administrator on 2017/7/27.
 */

class ActionCreator {
    static fetchUser(): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            new Promise<WxUser>((resolve, reject) => {
                if (getState().wxUser != null) {
                    return resolve(getState().wxUser)
                }
                dispatch({type: ActionType.FETCH_WX_USER, data: null});
                kit.getUserInfo().then(wxUser => {
                    dispatch({type: ActionType.FETCH_WX_USER_SUCC, data: wxUser});
                    resolve(wxUser)
                })
            }).then(wxUser => {
                if (getState().user != null) {
                    return;
                }
                dispatch({type: ActionType.FETCH_USER, data: null});
                return http.get<User>(`/user?wxId=${wxUser.nickName}`).then(user => {
                    dispatch({type: ActionType.FETCH_USER_SUCC, data: user});
                    return user;
                })
            })

        }
    }
}

module.exports = ActionCreator;
export  = ActionCreator;