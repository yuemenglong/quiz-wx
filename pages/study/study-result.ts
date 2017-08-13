import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import Quiz = require("../../common/entity/quiz");
import QuizData = require("../../common/state/quiz");
import ActionType = require("../../common/action-type");
import StudyData = require("../../common/state/study");
import kit = require("../../kit/kit");
import Study = require("../../common/entity/study");
import StudyResultData = require("../../common/state/study-result");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class StudyClass {
    data: StudyResultData = new StudyResultData;

    bindAnswer() {
        let quizId = store.getState().studyQuiz().id;
        store.dispatch(ActionCreator.putQuiz(quizId, {answerIdx: 0}, () => {
            wxx.redirectTo(`./study-answer`)
        }));
    }

    bindRedo() {
        let quizId = store.getState().studyQuiz().id;
        store.dispatch(ActionCreator.putQuiz(quizId, {answerIdx: 0}, () => {
            wxx.redirectTo(`./study-redo`)
        }));
    }

    bindFinish() {
        let quizId = store.getState().studyQuiz().id;
        store.dispatch(ActionCreator.putQuiz(quizId, {finished: true}, () => {
            store.dispatch(ActionCreator.putStudy({quizId: null}, () => {
                wxx.redirectTo(`../index/index`)
            }));
        }));
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new StudyResultData;
            let quiz = state.studyQuiz();
            if (quiz) {
                data.succ = quiz.questions.filter(q => q.correct).length;
                data.fail = quiz.questions.filter(q => !q.correct).length;
            }
            return _.merge({}, this.data, data);
        });
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {

    }
}

Page(new StudyClass());

