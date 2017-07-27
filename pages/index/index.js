"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionType = require("../../common/action-type");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */
var app = getApp();
Page({
    data: {},
    onLoad: function () {
        console.log("Page OnLoad");
        app.dispatch(ActionType.TEST, "hi");
    }
});
