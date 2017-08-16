import WxUser = require("../entity/wx-user");
import User = require("../entity/user");
import Question = require("../entity/question");
import QuizData = require("./quiz");
import ResultData = require("./result");
import GlobalData = require("./global");
import IndexData = require("./index");
import Quiz = require("../entity/quiz");
import Const = require("../const");
import _ = require("../../libs/lodash/index");
/**
 * Created by Administrator on 2017/7/27
 */


class State {
    user: User;
    wxUser: WxUser;
    questions: Question[] = [];

    quiz: QuizData = new QuizData;
    result: ResultData = new ResultData;

    global: GlobalData = new GlobalData;

    currentQuiz(): Quiz {
        return _.get(this, "user.quizs", []).filter(q => !q.finished)[0];
    }

    studyQuiz(): Quiz {
        return this.user.quizs.filter(q => q.id == this.user.study.quizId)[0];
    }
}

module.exports = State;
export = State;
