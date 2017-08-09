import Quiz = require("../entity/quiz");
import Question = require("../entity/question");
import QuizQuestion = require("../entity/quiz-question");
/**
 * Created by yml on 2017/8/6.
 */

class QuizData {
    inStudy: boolean = false;

    quiz: Quiz;
    question: QuizQuestion;
    mode: string;

    answer: string = "";
}

module.exports = QuizData;
export =QuizData;

