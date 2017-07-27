import ActionType = require("./action-type");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

interface Action {
    type: ActionType,
    data: any,
}

export = Action
