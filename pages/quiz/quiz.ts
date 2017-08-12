import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import kit = require("../../kit/kit");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import Quiz = require("../../common/entity/quiz");
import QuizData = require("../../common/state/quiz");
import ActionType = require("../../common/action-type");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class QuizClass {
    data: QuizData = new QuizData;

    //noinspection JSMethodCanBeStatic
    ensureInfo(question: QuizQuestion): void {
        let state = store.getState();
        // 已经有了
        if (question.info) {
            store.dispatch(ActionCreator.setQuizData({question}));
        } else if (state.questions[question.infoId]) {
            // 缓存里有，直接拼上
            question = _.defaults({info: state.questions[question.infoId]}, question);
            store.dispatch(ActionCreator.setQuizData({question}))
        } else {
            // 缓存里也没有，先拉到缓存里
            store.dispatch(ActionCreator.fetchQuestion(question.infoId, q => {
                question = _.defaults({info: q}, question);
                store.dispatch(ActionCreator.setQuizData({question}))
            }));
        }
    }

    getQuestion(quiz: Quiz): QuizQuestion {
        let mode = quiz.mode;
        let questions = quiz.questions;
        if (mode == "answer") {
            return questions.filter(qt => qt.answer == null)[0]
        } else if (mode == "review") {
            return questions.filter(qt => qt.correct == false && qt.idx > quiz.reviewIdx)[0]
        } else if (mode == "redo") {
            return questions.filter(qt => qt.correct == false && qt.idx > quiz.answerIdx)[0]
        } else if (mode == "study") {
            return questions.filter(qt => qt.idx > quiz.reviewIdx)[0]
        } else {
            throw Error("Unknown Mode");
        }
    }

    nextOrResult() {
        let question = this.getQuestion(this.data.quiz);
        if (question == null) {
            wxx.redirectTo(`../result/result`)
        } else {
            this.ensureInfo(question);
        }
    }

    submitAnswer(answer) {
        store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
            this.nextOrResult();
        }));
    }

    //noinspection JSUnusedGlobalSymbols
    bindAnswer(e) {
        if (["review", "study"].indexOf(this.data.mode) >= 0) {
            return;
        }
        let answer = e.target.dataset.answer;
        if (!this.data.question.info.multi) {
            return this.submitAnswer(answer);
        } else if (this.data.answer.indexOf(answer) >= 0) {
            // 删掉答案
            answer = this.data.answer.split("").filter(c => c != answer).join("");
            store.dispatch(ActionCreator.setQuizData({answer}));
        } else {
            // 增加答案
            answer = this.data.answer + answer;
            answer = answer.split("").sort().join("");
            store.dispatch(ActionCreator.setQuizData({answer}));
        }
    }

    //noinspection JSUnusedGlobalSymbols
    bindSkip() {
        this.submitAnswer("");
    }

    //noinspection JSUnusedGlobalSymbols
    bindSubmit() {
        return this.submitAnswer(this.data.answer)
    }

    //noinspection JSUnusedGlobalSymbols
    bindNext() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {reviewIdx: this.data.question.idx}, () => {
            return this.nextOrResult();
        }));
        // store.dispatch(ActionCreator.setQuizData({idx: this.data.question.idx}));
    }

    //noinspection JSUnusedGlobalSymbols
    bindMark() {
        store.dispatch(ActionCreator.postMark(this.data.question.id, () => {
            wxx.showToast("收藏成功");
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    bindUnMark() {
        store.dispatch(ActionCreator.deleteMark(this.data.mark.id, () => {
            wxx.showToast("取消收藏成功");
        }))
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindDebug() {
        return store.dispatch(ActionCreator.postDebugInfo());
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let quizId = state.global.quizId;
            let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
            let mode = quiz.mode;
            let question = this.getQuestion(quiz);
            let mark = state.user.marks.filter(m => m.infoId == question.id)[0];
            return _.merge({}, state.quiz, {quiz, mode, mark})
        });
        this.nextOrResult();
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {
        let state = store.getState();
        // quiz一定存在
        let quizId = state.global.quizId;
        let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
        let mode = quiz.mode;
        let inStudy = state.global.inStudy; // 在学习状态
        store.dispatch(ActionCreator.setQuizData({quiz, mode, inStudy}));
    }
}

Page(new QuizClass());

// Page({
//     data: {
//         quizId: null,
//         quiz: null,
//         question: null,
//
//         answer: null, // answer
//         idx: null, // review
//         type: "quiz", //quiz study
//         mode: "answer", //study answer review redo
//     },
//     isMulti: function () {
//         return this.data.question.info.multi;
//     },
//     bindAnswer: function (e) {
//         if (["review", "study"].indexOf(this.data.mode) >= 0) {
//             return;
//         }
//         let answer = e.target.dataset.answer;
//         if (!this.isMulti()) {
//             return this.submitAnswer(answer);
//         } else if (this.data.answer.indexOf(answer) >= 0) {
//             // 删掉答案
//             answer = this.data.answer.split("").filter(c => c != answer).join("");
//             this.changeAnswer(answer);
//         } else {
//             // 增加答案
//             answer = this.data.answer + answer;
//             answer = answer.split("").sort().join("");
//             this.changeAnswer(answer);
//         }
//     },
//     bindSkip: function () {
//         return this.submitAnswer("")
//     },
//     bindSubmit: function () {
//         return this.submitAnswer(this.data.answer)
//     },
//     bindNext: function () {
//         return store.dispatch(ActionCreator.gotoNext(this.data.question.idx));
//     },
//     bindDebug: function () {
//         return store.dispatch(ActionCreator.postDebugInfo());
//     },
//     changeAnswer: function (answer) {
//         return store.dispatch(ActionCreator.changeAnswer(answer));
//     },
//     submitAnswer: function (answer) {
//         return store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer))
//     },
//     onUpdate: function (data, dispatch) {
//         let quiz = data.quiz;
//         let question = data.question;
//         if (quiz.questions.length == 0) {
//             dispatch(ActionCreator.fetchQuiz(quiz.id))
//         }
//         if (question && question.info == null) {
//             dispatch(ActionCreator.fetchQuestion(question.infoId))
//         }
//         let finished = quiz.questions.length > 0 && !question;
//         if (finished && ["answer", "redo"].indexOf(data.mode) >= 0) {
//             let answered = quiz.questions.every(q => q.answer != null);
//             let corrected = quiz.questions.every(q => q.correct);
//             store.dispatch(ActionCreator.putQuiz(data.quizId, answered, corrected))
//         }
//         if (finished) {
//             wxx.redirectTo(`../result/result?id=${quiz.id}&mode=${data.mode}&type=${data.type}`)
//         }
//     },
//     onLoad: function (query) {
//         let quizId = query.id;
//         let mode = query.mode || "answer";
//         let type = query.type || "quiz";
//         store.dispatch(ActionCreator.setQuizData(quizId, type, mode, 0));
//     },
//     onShow: function () {
//         WxRedux.connect(this, (state: State) => {
//             let quiz = state.user.quizs.filter(quiz => quiz.id == state.quiz.quizId)[0];
//             let question = null;
//             if (state.quiz.mode == "answer") {
//                 question = quiz.questions.filter(qt => qt.answer == null)[0]
//             } else if (state.quiz.mode == "review") {
//                 question = quiz.questions.filter(qt => qt.correct == false && qt.idx > state.quiz.idx)[0]
//             } else if (state.quiz.mode == "redo") {
//                 question = quiz.questions.filter(qt => qt.correct == false && qt.idx > state.quiz.idx)[0]
//             } else if (state.quiz.mode == "study") {
//                 question = quiz.questions.filter(qt => qt.idx > state.quiz.idx)[0]
//             }
//             if (question && !question.info) {
//                 let info = state.questions[question.infoId];
//                 question = _.defaults({info}, question);
//             }
//             return _.merge({quiz, question}, state.quiz)
//         });
//     },
// });

