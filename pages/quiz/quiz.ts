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
        answer: "",
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
        console.log(this.data.answer);
        let answer = e.target.dataset.answer;
        if (!this.isMulti()) {
            return this.submitAnswer(answer);
        } else if (this.data.answer.indexOf(answer) >= 0) {
            // 删掉答案
            answer = this.data.answer.split("").filter(c => c != answer).join("");
            this.setData({answer})
        } else {
            // 增加答案
            answer = this.data.answer + answer;
            answer = answer.split("").sort().join("");
            this.setData({answer})
        }

    },
    bindSubmit: function () {
        this.setData({answer: ""});
        return this.submitAnswer(this.data.answer)
    },
    submitAnswer: function (answer) {
        return store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
    },
    nextQuestion: function (quiz): QuizQuestion {
        if (this.isNormal()) {
            return quiz.questions.filter(qt => qt.answer == null)[0]
        } else if (this.isReview()) {
            throw Error("Not Implement")
        }
    },
    onUpdate: function (data, dispatch) {
        let quiz = data.quiz;
        let question = data.question;
        if (quiz.questions.length == 0) {
            dispatch(ActionCreator.fetchQuiz(quiz.id))
        }
        if (question && question.info == null) {
            dispatch(ActionCreator.fetchQuestion(question.infoId))
        }
        let finished = quiz.questions.length > 0 && !question;
        if (finished) {
            wxx.navigateTo(`../result/result?id=${quiz.id}`)
        }
    },
    onLoad: function (query) {
        const quizId = query.id;
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == quizId)[0];
            let question = this.nextQuestion(quiz);
            if (question && !question.info) {
                let info = state.questions[question.infoId];
                question = _.defaults({info}, question);
            }
            return {quiz, question}
        })
    }
});

