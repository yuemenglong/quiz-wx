import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class QuizResultData {
    succ: number;
    fail: number;
}

class QuizResultClass {
    bindAnswer() {
        let quizId = store.getState().user.quiz.id;
        store.dispatch(ActionCreator.putQuiz(quizId, {mode: "quiz", idx: 0}, () => {
            wxx.redirectTo(`./quiz-answer`)
        }));
    }

    bindReview() {
        let quizId = store.getState().user.quiz.id;
        store.dispatch(ActionCreator.putQuiz(quizId, {mode: "review", idx: 0}, () => {
            wxx.redirectTo(`./quiz-review`)
        }));
    }

    bindRedo() {
        let quizId = store.getState().user.quiz.id;
        store.dispatch(ActionCreator.putQuiz(quizId, {mode: "redo", idx: 0}, () => {
            store.dispatch(ActionCreator.clearUncorrectAnswer(store.getState().user.quiz, () => {
                wxx.redirectTo(`./quiz-redo`)
            }));
        }));
    }

    bindFinish() {
        store.dispatch(ActionCreator.deleteQuiz(store.getState().user.quiz, () => {
            wxx.navigateBack()
        }));
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new QuizResultData;
            let quiz = state.user.quiz;
            if (quiz) {
                data.succ = quiz.questions.filter(q => q.correct).length;
                data.fail = quiz.questions.filter(q => !q.correct).length;
            }
            return _.merge({}, data);
        });
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {

    }
}

Page(new QuizResultClass());

