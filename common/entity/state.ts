import WxUser = require("./wx-user");
import User = require("./user");
import Question = require("./question");
/**
 * Created by Administrator on 2017/7/27.
 */

class Page {
    idx: number;
    answer: string;
    mode: string;
    quizId: number;
}

class State {
    user: User;
    wxUser: WxUser;
    questions: Question[] = [];
    page: Page = new Page;
}

module.exports = State;
export = State;
