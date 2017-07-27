import ActionType = require("../../common/action-type");
import {App, Component} from "../../common/interface";
import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/entity/state");
import WxUser = require("../../common/entity/wx-user");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

const app = getApp() as App;

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
    bindQuickStart:function(e){
        //1. 找到一个没有做完的quiz
        let quiz = this.data.user.quizs.find(quiz=>{
            return quiz.answered
        })
    },
    onLoad: function () {
        WxRedux.connect(this, this.stateMapper);
        console.log("Page OnLoad");
    }
});
