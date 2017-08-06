import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import kit = require("../../kit/kit");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
/**
 * Created by Administrator on 2017/7/27.
 */

Page({
    data: {
        quizId: null,
        mode: null,
        updating: false,

        quiz: null,
        fail: null,
        succ: null,
    },
    bindCont: function () {
        let type = this.data.type;
        if (type == "study") {
            //1. study type
        } else if (type == "quiz") {
            //2. quiz type
            let quiz = store.getState().user.quizs.find(q => !q.answered || !q.corrected);
            if (quiz) {
                wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
            } else {
                store.dispatch(ActionCreator.newQuiz(quiz => {
                    wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
                }))
            }
        }
    },
    bindReview: function () {
        let type = this.data.type;
        wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=review&type=${type}`)
    },
    bindRedo: function () {
        let type = this.data.type;
        wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=redo&type=${type}`)
    },
    bindAnswer: function () {
        let type = this.data.type;
        wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=answer&type=${type}`)
    },
    onUpdate: function (data, dispatch) {
        if (data.type == "study" && data.fail == 0 && data.updating == false) {
            // 更新study
            let studyIdx = data.quiz.questions.slice(-1)[0].id;
            dispatch(ActionCreator.setResultData({updating: true}));
            dispatch(ActionCreator.putStudy(studyIdx, () => {
                dispatch(ActionCreator.setResultData({updating: false}));
            }))
        }
    },
    onLoad: function (query) {
        let quizId = query.id;
        let mode = query.mode;
        let type = query.type;
        store.dispatch(ActionCreator.setResultData({quizId, type, mode}))
    },
    onShow: function () {
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == state.result.quizId)[0];
            let fail = quiz.questions.filter(q => q.correct == false).length;
            let succ = quiz.questions.filter(q => q.correct == true).length;
            return _.merge({quiz, fail, succ}, state.result);
        })
    }
});

