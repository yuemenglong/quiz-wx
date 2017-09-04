import QuizQuestion = require("../../common/entity/quiz-question");
import Quiz = require("../../common/entity/quiz");
import QestionPage = require("../base/question-page");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import QuestionData = require("../base/question-data");
import _ = require("../../libs/lodash/index");
import moment = require("../../libs/moment/moment");
import State = require("../../common/state/state");

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

    dataMapper(data: QuestionData, state: State): QuestionData {
        let gap = new Date().valueOf() - state.quizData.startTime;
        let timer = moment(gap).format("mm:ss");
        data = _.merge({timer}, data);
        if (!data.answer && _.get(data, "question.answer")) {
            // 为了解决上一题能够显示之前已经回答的答案
            data.answer = data.question.answer;
            return _.merge({answer: data.question.answer}, data)
        } else {
            return data;
        }
    }
}

Page(new QuizAnswerClass());

