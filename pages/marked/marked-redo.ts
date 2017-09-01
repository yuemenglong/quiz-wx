import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import MarkedBaseClass = require("./marked-base");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class MarkedRedoClass extends MarkedBaseClass {
    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions.filter(q => q.idx > quiz.idx && !q.correct)[0]
    }
}

Page(new MarkedRedoClass());

