import ActionType = require("./action-type");
/**
 * Created by Administrator on 2017/7/27.
 */

interface App {
    dispatch(type: ActionType, data: any): void
    dispatch(fn: (dispatch, getState) => void): void
}

export = App
