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
        quiz: null,
        question: null,
        mode: "normal",
        finished: false,
    },
    isNormal: function () {
        return this.data.mode == "normal";
    },
    isReview: function () {
        return this.data.mode == "review";
    },
    isMulti: function () {
        return this.data.question.info.multi;
    },
    bindAnswer: function (e) {
        let answer = e.target.dataset.answer;
        if (!this.isMulti()) {
            return store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
        } else {
            let newAnswer = this.data.question.answer || "" + answer;
            newAnswer = newAnswer.split("").sort().join("");
            return store.dispatch(ActionCreator.mergeAnswer(this.data.quiz.id, this.data.question.id, newAnswer))
        }
    },
    bindAgain: function () {
        store.dispatch(ActionCreator.newQuiz(quiz => {
            wxx.navigateTo(`/quiz?id=${quiz.id}`)
        }))
    },
    nextQuestion: function (quiz): QuizQuestion {
        if (this.isNormal()) {
            return quiz.questions.filter(qt => qt.answer == null)[0]
        } else if (this.isReview()) {
            throw Error("Not Implement")
        }
    },
    onUpdate: function (data, dispatch) {
        console.log("Quiz On Update", data);
        let quiz = data.quiz;
        let question = data.question;
        if (quiz.questions.length == 0) {
            dispatch(ActionCreator.fetchQuiz(quiz.id))
        }
        if (question && question.info == null) {
            dispatch(ActionCreator.fetchQuestion(question.infoId))
        }
    },
    onLoad: function (query) {
        let that = this;
        const quizId = query.id;
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == quizId)[0];
            let question = that.nextQuestion(quiz);
            if (question && !question.info) {
                let info = state.questions[question.infoId];
                question = _.defaults({info}, question);
            }
            let finished = quiz.questions.length > 0 && !question;
            return {quiz, question, finished}
        })
    }
});

