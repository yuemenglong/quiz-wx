import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import Mark = require("../../common/entity/mark");

class QuestionData {
    quiz: Quiz;
    question: QuizQuestion;
    answer: string = "";
    mark: Mark = null;
    isFirst: boolean = false;
    isLast: boolean = false;

    a: String = null;
    b: String = null;
    c: String = null;
    d: String = null;
}

module.exports = QuestionData;
export = QuestionData;