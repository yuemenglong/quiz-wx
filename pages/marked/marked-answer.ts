import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import MarkedBaseClass = require("./marked-base");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class MarkedAnswerClass extends MarkedBaseClass {
    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions[quiz.idx]
    }
}

Page(new MarkedAnswerClass());
