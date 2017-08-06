import Quiz = require("../entity/quiz");
import Question = require("../entity/question");
/**
 * Created by yml on 2017/8/6.
 */

class QuizData {
    idx: number = 0;
    answer: string = "";
    type: string;
    mode: string;

    quizId: number;
    quiz: Quiz;
    question: Question;
}

module.exports = QuizData;
export =QuizData;

