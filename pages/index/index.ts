import ActionType = require("../../common/action-type");
import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/entity/state");
import WxUser = require("../../common/entity/wx-user");
import kit = require("../../kit/wxx");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
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
    bindQuickStart: function (e) {
        //1. 找到一个没有做完的quiz
        let quiz = this.data.user.quizs.find(quiz => {
            return quiz.answered != true || quiz.corrected != true
        });
        if (quiz != null) {
            return wxx.navigateTo(`../quiz/quiz?id=${quiz.id}`)
        }
        //2. 没有则建立新quiz
        store.dispatch(ActionCreator.newQuiz(quiz => {
            return wxx.navigateTo(`../quiz/quiz?id=${quiz.id}`)
        }))
    },
    bindStudy: function (e) {
        //1. 如果study里面有quiz，直接使用这个quiz进入study模式
        let quiz = this.data.user.study.quiz;
        if (quiz != null) {
            return wxx.navigateTo(`../quiz/quiz?id=${quiz.id}&mode=study&type=study`)
        }
        //2. 没有则创建study quiz，然后进入study模式
        store.dispatch(ActionCreator.newStudyQuiz(quiz => {
            return wxx.navigateTo(`../quiz/quiz?id=${quiz.id}&mode=study&type=study`)
        }))
    },
    bindDebug: function () {
        return store.dispatch(ActionCreator.postDebugInfo());
    },
    onShow: function () {
        WxRedux.connect(this, this.stateMapper);
    }
});
