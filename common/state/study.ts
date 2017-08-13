import Quiz = require("../entity/quiz");
import Question = require("../entity/question");
import QuizQuestion = require("../entity/quiz-question");
import Mark = require("../entity/mark");
/**
 * Created by yml on 2017/8/6.
 */

class StudyData {
    quiz: Quiz;
    question: QuizQuestion;
    answer: string = "";
    mark: Mark = null;
    isFirst: boolean = false;
    isLast: boolean = false;
}

module.exports = StudyData;
export =StudyData;

