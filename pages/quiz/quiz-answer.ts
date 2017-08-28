import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import QestionPage = require("../base/question-page");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import QuestionData = require("../base/question-data");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class QuizAnswerClass extends QestionPage {
    gotoResult() {
        wxx.redirectTo(`./quiz-result`)
    }

    submitAnswer(answer) {
        store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
            this.nextOrResult();
        }));
    }

    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions[quiz.idx]
    }

    dataMapper(data: QuestionData): QuestionData {
        if (!data.answer && data.question.answer) {
            data.answer = data.question.answer
        }
        return data;
    }
}

Page(new QuizAnswerClass());

