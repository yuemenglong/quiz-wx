import WxUser = require("./wx-user");
import User = require("./user");
import Question = require("./question");
/**
 * Created by Administrator on 2017/7/27.
 */

class Page {
    idx: number = 0;
    answer: string = "";
    mode: string;
    quizId: number;
}

class Result {
    mode: string;
    quizId: number;
}

class State {
    user: User;
    wxUser: WxUser;
    questions: Question[] = [];

    page: Page = new Page;
    result:Result = new Result;
}

module.exports = State;
export = State;
