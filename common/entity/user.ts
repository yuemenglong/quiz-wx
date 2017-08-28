import Quiz = require("./quiz");
import Mark = require("./mark");
import WxUserInfo = require("./wx-user-info");

/**
 * Created by Administrator on 2017/7/27.
 */

class User {
    id: number;
    code: string;
    wxUserInfo: WxUserInfo;

    study: Quiz;
    quiz: Quiz;
    marked: Quiz;

    marks: Array<Mark>;
}

module.exports = User;
export = User