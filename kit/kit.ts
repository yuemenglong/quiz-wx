import QuizQuestion = require("../common/entity/quiz-question");
import store = require("../reducer/store");
import ActionCreator = require("../reducer/action-creator");
import _ = require("../libs/lodash/index");
import User = require("../common/entity/user");
import Quiz = require("../common/entity/quiz");

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

    static getCurrentQuiz(user: User): Quiz {
        if (user.study) {
            return user.study;
        } else if (user.quiz) {
            return user.quiz;
        } else if (user.marked) {
            return user.marked;
        } else {
            return null;
        }
    }
}

module.exports = kit;
export = kit;