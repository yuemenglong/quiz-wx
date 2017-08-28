import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import StudyBaseClass = require("./study-base");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class StudyRedoClass extends StudyBaseClass {
    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions.filter(q => q.idx > quiz.idx && !q.correct)[0]
    }
}

Page(new StudyRedoClass());

