import User = require("../entity/user");
import Question = require("../entity/question");
import Quiz = require("../entity/quiz");
import _ = require("../../libs/lodash/index");

/**
 * Created by Administrator on 2017/7/27
 */

class QuizData {
    answer: string;
}

class State {
    user: User;
    questions: Question[] = [];
    quizData: QuizData;

    currentQuiz(): Quiz {
        return _.get(this, "user.quizs", []).filter(q => !q.finished)[0];
    }

    studyQuiz(): Quiz {
        return this.user.study
    }
}

module.exports = State;
export = State;
