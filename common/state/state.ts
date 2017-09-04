import User = require("../entity/user");
import Question = require("../entity/question");

/**
 * Created by Administrator on 2017/7/27
 */

class QuizData {
    answer: string;
    startTime: number;
}

class State {
    user: User;
    questions: Question[] = [];
    quizData: QuizData = new QuizData;
}

module.exports = State;
export = State;
