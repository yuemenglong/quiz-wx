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
    onUpdate: function (state) {
        console.log("Index Update", state)
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
    onLoad: function () {
        WxRedux.connect(this, this.stateMapper);
    }
});
