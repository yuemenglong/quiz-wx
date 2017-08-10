import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import kit = require("../../kit/kit");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import ResultData = require("../../common/state/result");
import Const = require("../../common/const");
/**
 * Created by Administrator on 2017/7/27
 */

class ResultClass {
    data: ResultData = new ResultData;

    // answer / redo -> answer
    bindContQuiz() {
        let quiz = store.getState().currentQuiz();
        if (quiz) {
            store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
            wxx.redirectTo(`../quiz/quiz`)
        } else {
            store.dispatch(ActionCreator.newQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
                wxx.redirectTo(`../quiz/quiz`)
            }))
        }
    }

    // answer / redo -> study
    bindContStudy() {
        store.dispatch(ActionCreator.newStudyQuiz(quiz => {
            store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
            wxx.redirectTo(`../quiz/quiz`)
        }))
    }

    // answer / redo -> review
    bindReview() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "review", reviewIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    // review -> redo
    bindRedo() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "redo", answerIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    // study -> answer
    bindAnswer() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "answer", answerIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    onLoad() {
        let state = store.getState();
        let quizId = state.global.quizId;
        let quiz = state.user.quizs.filter(q => q.id == quizId)[0];

        let fail = quiz.questions.filter(q => q.correct == false).length;
        let inStudy = state.global.inStudy;
        if (fail == 0) {
            // 测验完成
            store.dispatch(ActionCreator.putQuiz(quizId, {answered: true, corrected: true}, () => {
            }));
        }
        if (fail == 0 && inStudy) {
            // 完成本次study
            let studyIdx = quiz.questions.slice(-1)[0].infoId;
            store.dispatch(ActionCreator.putStudy({studyIdx, quizId: null}, () => {
            }));
        }
    }

    onShow() {
        WxRedux.connect(this, (state: State) => {
            let quizId = state.global.quizId;
            let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
            let mode = quiz.mode;
            let inStudy = state.global.inStudy;
            let fail = quiz.questions.filter(q => q.correct == false).length;
            let succ = quiz.questions.filter(q => q.correct == true).length;
            let hasMoreStudy = state.hasMoreStudy();
            return _.merge({}, state.result, {quiz, fail, succ, mode, inStudy, hasMoreStudy});
        })
    }
}

Page(new ResultClass());

