"use strict";
var Study = require("./study");
/**
 * Created by Administrator on 2017/7/27.
 */
var User = (function () {
    function User() {
        this.study = new Study();
        this.quizs = [];
    }
    return User;
}());
module.exports = User;
module.exports = User;
