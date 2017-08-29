import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import QestionPage = require("../base/question-page");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class QuizReviewClass extends QestionPage {
    submitAnswer(answer: any) {
    }

    gotoResult() {
        wxx.redirectTo(`./quiz-result`)
    }

    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions.filter(q => q.idx > quiz.idx && !q.correct)[0]
    }
}

Page(new QuizReviewClass());

