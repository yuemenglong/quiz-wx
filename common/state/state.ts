import User = require("../entity/user");
import Question = require("../entity/question");
import Chapter = require("../entity/chapter");

/**
 * Created by Administrator on 2017/7/27
 */

class QuizData {
    answer: string;
    startTime: number;
    ticker: number = 0;
    interval: any = null;
}

class State {
    user: User;
    questions: Question[] = [];
    chapters: Chapter[] = [];
    quizData: QuizData = new QuizData;
}

module.exports = State;
export = State;
