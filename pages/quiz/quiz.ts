import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/entity/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import kit = require("../../kit/kit");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import Quiz = require("../../common/entity/quiz");
/**
 * Created by Administrator on 2017/7/27.
 */

Page({
    data: {
        quiz: null,
        question: null,

        answer: null, // normal
        idx: null, // review
        mode: "normal",

        unConnect: null,
    },
    isReview: function () {
        return this.data.mode == "review";
    },
    isMulti: function () {
        return this.data.question.info.multi;
    },
    bindAnswer: function (e) {
        if (this.isReview()) {
            return;
        }
        let answer = e.target.dataset.answer;
        if (!this.isMulti()) {
            return this.submitAnswer(answer);
        } else if (this.data.answer.indexOf(answer) >= 0) {
            // 删掉答案
            answer = this.data.answer.split("").filter(c => c != answer).join("");
            this.changeAnswer(answer);
        } else {
            // 增加答案
            answer = this.data.answer + answer;
            answer = answer.split("").sort().join("");
            this.changeAnswer(answer);
        }

    },
    bindSubmit: function () {
        this.setData({answer: ""});
        return this.submitAnswer(this.data.answer)
    },
    bindReviewNext: function () {
        return store.dispatch(ActionCreator.reviewNext(this.data.question.idx));
    },
    changeAnswer: function (answer) {
        return store.dispatch(ActionCreator.changeAnswer(answer));
    },
    submitAnswer: function (answer) {
        return store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
    },
    nextQuestion: function (quiz: Quiz, mode: String): QuizQuestion {
        if (mode == "normal") {
            return quiz.questions.filter(qt => qt.answer == null)[0]
        } else if (mode == "review") {
            return quiz.questions.filter(qt => qt.correct == false && qt.idx > this.data.idx)[0]
        }
    },
    onUpdate: function (data, dispatch) {
        console.log("Update", data);
        let quiz = data.quiz;
        let question = data.question;
        if (quiz.questions.length == 0) {
            dispatch(ActionCreator.fetchQuiz(quiz.id))
        }
        if (question && question.info == null) {
            dispatch(ActionCreator.fetchQuestion(question.infoId))
        }
        let finished = false;
        if (data.mode == "normal") {
            finished = quiz.questions.length > 0 && !question;
        } else if (data.mode == "review") {
            finished = quiz.questions.length > 0 && !question;
        }
        if (finished) {
            wxx.navigateTo(`../result/result?id=${quiz.id}`)
        }
    },
    onLoad: function (query) {
        let quizId = query.id;
        let mode = query.mode || "normal";
        store.dispatch(ActionCreator.initPage(quizId, mode));
    },
    onShow: function () {
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == state.page.quizId)[0];
            let question = this.nextQuestion(quiz, state.page.mode);
            if (question && !question.info) {
                let info = state.questions[question.infoId];
                question = _.defaults({info}, question);
            }
            return _.merge({quiz, question}, state.page)
        });
    },
});

