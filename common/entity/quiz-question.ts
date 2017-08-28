import Question = require("./question");
import Quiz = require("./quiz");
/**
 * Created by Administrator on 2017/7/27.
 */

class QuizQuestion {
    id: number;

    seq: string;
    info: Question;

    quiz: Quiz;

    idx: number;
    answer: string;
    fails: number;
    correct: Boolean;

    quizId: number;
    infoId: number;
}

module.exports = QuizQuestion;
export = QuizQuestion
