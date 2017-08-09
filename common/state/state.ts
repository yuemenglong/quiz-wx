import WxUser = require("../entity/wx-user");
import User = require("../entity/user");
import Question = require("../entity/question");
import QuizData = require("./quiz");
import ResultData = require("./result");
import GlobalData = require("./global");
/**
 * Created by Administrator on 2017/7/27.
 */


class State {
    user: User;
    wxUser: WxUser;
    questions: Question[] = [];

    quiz: QuizData = new QuizData;
    result: ResultData = new ResultData;

    global: GlobalData = new GlobalData;
}

module.exports = State;
export = State;
