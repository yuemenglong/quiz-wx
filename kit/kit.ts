import QuizQuestion = require("../common/entity/quiz-question");
import store = require("../reducer/store");
import ActionCreator = require("../reducer/action-creator");
import _ = require("../libs/lodash/index");
/**
 * Created by yml on 2017/8/12.
 */

class kit {
    static ensureInfo(question: QuizQuestion): void {
        let state = store.getState();
        // 已经有了
        if (question.info) {
            // store.dispatch(ActionCreator.setQuizData({question}));
        } else if (state.questions[question.infoId]) {
            // 缓存里有，直接拼上
            // question = _.defaults({info: state.questions[question.infoId]}, question);
            // store.dispatch(ActionCreator.setQuizData({question}))
        } else {
            // 缓存里也没有，先拉到缓存里
            store.dispatch(ActionCreator.fetchQuestion(question.infoId, q => {
                // question = _.defaults({info: q}, question);
                // store.dispatch(ActionCreator.setQuizData({question}))
            }));
        }
    }
}

module.exports = kit;
export = kit;