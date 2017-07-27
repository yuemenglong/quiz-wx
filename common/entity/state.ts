import WxUser = require("./wx-user");
import User = require("./user");
import Question = require("./question");
/**
 * Created by Administrator on 2017/7/27.
 */

class State {
    user: User;
    wxUser: WxUser;
    questions: Question[];
}

module.exports = State;
export = State;
