import ActionType = require("./action-type");
import Store = require("./store");
/**
 * Created by Administrator on 2017/7/27.
 */

interface App {
    dispatch(type: ActionType, data: any): void
    dispatch(fn: (dispatch, getState) => void): void
    store: Store
}

export = App
