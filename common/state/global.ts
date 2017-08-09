import Quiz = require("../entity/quiz");
import Question = require("../entity/question");
import QuizQuestion = require("../entity/quiz-question");
/**
 * Created by yml on 2017/8/6.
 */

class GlobalData {
    inStudy: boolean = false;
    quizId: number = null;
}

module.exports = GlobalData;
export =GlobalData;

