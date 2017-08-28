import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import QestionPage = require("../base/QuestionPage");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class StudyAnswerClass extends QestionPage {
    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions[quiz.idx]
    }
}

Page(new StudyAnswerClass());

