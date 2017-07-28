import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/entity/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
/**
 * Created by Administrator on 2017/7/27.
 */

Page({
    data: {
        quiz: null,
        question: null,
        mode: "normal",
    },
    isNormal: function () {
        return this.data.mode == "normal";
    },
    isReview: function () {
        return this.data.mode == "review";
    },
    bindAnswer: function (e) {
        let answer = "a";
        store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
    },
    nextQuestion: function (quiz): QuizQuestion {
        if (this.isNormal()) {
            return quiz.questions.filter(qt => qt.answer == null)[0]
        } else if (this.isReview()) {
            throw Error("Not Implement")
        }
    },
    onUpdate: function (data) {
        console.log("Quiz On Update", data);
        let quiz = data.quiz;
        let question = data.question;
        if (quiz.questions.length == 0) {
            store.dispatch(ActionCreator.fetchQuiz(quiz.id))
        }
        if (question && question.info == null) {
            store.dispatch(ActionCreator.fetchQuestion(question.infoId))
        }
    },
    onLoad: function (query) {
        let that = this;
        const quizId = query.id;
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == quizId)[0];
            let question = that.nextQuestion(quiz);
            if (question && !question.info) {
                question.info = state.questions[question.infoId]
            }
            return {quiz, question}
        })
    }
});

