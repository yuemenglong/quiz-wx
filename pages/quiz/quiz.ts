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
        quizId: null,
        quiz: null,
        question: null,

        answer: null, // answer
        idx: null, // review
        mode: "answer",
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
    bindSkip: function () {
        return this.submitAnswer("")
    },
    bindSubmit: function () {
        return this.submitAnswer(this.data.answer)
    },
    bindReviewNext: function () {
        return store.dispatch(ActionCreator.reviewNext(this.data.question.idx));
    },
    bindDebug: function () {
        return store.dispatch(ActionCreator.postDebugInfo());
    },
    changeAnswer: function (answer) {
        return store.dispatch(ActionCreator.changeAnswer(answer));
    },
    submitAnswer: function (answer) {
        return store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
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
        if (finished && data.mode != "review") {
            let answered = quiz.questions.every(q => q.answer != null);
            let corrected = quiz.questions.every(q => q.correct);
            store.dispatch(ActionCreator.putQuiz(data.quizId, answered, corrected))
        }
        if (finished) {
            wxx.redirectTo(`../result/result?id=${quiz.id}&mode=${data.mode}`)
        }
    },
    onLoad: function (query) {
        let quizId = query.id;
        let mode = query.mode || "answer";
        store.dispatch(ActionCreator.initQuiz(quizId, mode, 0));
    },
    onShow: function () {
        WxRedux.connect(this, (state: State) => {
            let quiz = state.user.quizs.filter(quiz => quiz.id == state.page.quizId)[0];
            let question = null;
            if (state.page.mode == "answer") {
                question = quiz.questions.filter(qt => qt.answer == null)[0]
            } else if (state.page.mode == "review") {
                question = quiz.questions.filter(qt => qt.correct == false && qt.idx > state.page.idx)[0]
            } else if (state.page.mode == "redo") {
                question = quiz.questions.filter(qt => qt.correct == false && qt.idx > state.page.idx)[0]
            }
            if (question && !question.info) {
                let info = state.questions[question.infoId];
                question = _.defaults({info}, question);
            }
            return _.merge({quiz, question}, state.page)
        });
    },
});

