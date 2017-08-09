import ActionType = require("../../common/action-type");
import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import WxUser = require("../../common/entity/wx-user");
import kit = require("../../kit/wxx");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

Page({
    data: {
        wxUser: null,
        user: null,
    },
    stateMapper: function (state: State) {
        return {
            wxUser: state.wxUser,
            user: state.user,
        }
    },
    bindQuickStart: function () {
        // 找到一个没有做完的quiz
        let quiz = this.data.user.quizs.find(quiz => {
            return quiz.answered != true || quiz.corrected != true
        });
        if (quiz == null) {
            // 没有则建立新quiz
            return store.dispatch(ActionCreator.newQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else if (quiz.questions.length == 0) {
            // 拿到quiz详情
            return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else {
            // quiz存在且有详情信息
            store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
            return wxx.navigateTo(`../quiz/quiz`)
        }
    },
    bindStudy: function () {
        store.dispatch(ActionCreator.setGlobalData({inStudy: true}));
        let quiz = this.data.user.study.quiz;
        if (quiz != null && quiz.questions.length > 0) {
            // 有quiz，quiz里有questions
            store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
            return wxx.navigateTo(`../quiz/quiz`)
        } else if (quiz != null && quiz.questions.length == 0) {
            // 有quiz，quiz里没有question
            return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else {
            // 没有quiz
            return store.dispatch(ActionCreator.newStudyQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        }
    },
    bindDebug: function () {
        return store.dispatch(ActionCreator.postDebugInfo());
    },
    onShow: function () {
        store.connect(this, this.stateMapper);
    }
});
