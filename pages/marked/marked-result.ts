import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class MarkedResultData {
    succ: number;
    fail: number;
}

class MarkedResultClass {
    bindAnswer() {
        let quizId = store.getState().user.marked.id;
        store.dispatch(ActionCreator.putQuiz(quizId, {mode: "marked", idx: 0}, () => {
            wxx.redirectTo(`./marked-answer`)
        }));
    }

    bindRedo() {
        let quizId = store.getState().user.marked.id;
        store.dispatch(ActionCreator.putQuiz(quizId, {mode: "redo", idx: 0}, () => {
            wxx.redirectTo(`./marked-redo`)
        }));
    }

    bindFinish() {
        store.dispatch(ActionCreator.deleteQuiz(store.getState().user.marked, () => {
            wxx.redirectTo(`../index/index`)
        }));
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new MarkedResultData;
            let quiz = state.user.marked;
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

Page(new MarkedResultClass());

