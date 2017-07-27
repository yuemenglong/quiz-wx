import WxUser = require("./wx-user");
import User = require("./user");
/**
 * Created by Administrator on 2017/7/27.
 */

class State {
    user: User;
    wxUser: WxUser
}

module.exports = State;
export = State;
