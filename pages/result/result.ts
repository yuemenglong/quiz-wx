import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/entity/state");
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

        quiz: null,
        fail: null,
        succ: null,
    },
    bindNew: function () {
        store.dispatch(ActionCreator.newQuiz(quiz => {
            wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
        }))
    },
    bindReview: function () {
        wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=review`)
    },
    bindRedo: function () {
        wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=redo`)
    },
    onUpdate: function (data, dispatch) {
    },
    onLoad: function (query) {
        let quizId = query.id;
        let mode = query.mode;
        store.dispatch(ActionCreator.initResult(quizId, mode))
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

