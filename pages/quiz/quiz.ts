// import State = require("../../common/state/state");
// import store = require("../../reducer/store");
// import ActionCreator = require("../../reducer/action-creator");
// import Question = require("../../common/entity/question");
// import QuizQuestion = require("../../common/entity/quiz-question");
// import kit = require("../../kit/op");
// import _ = require("../../libs/lodash/index");
// import wxx = require("../../kit/wxx");
// import Quiz = require("../../common/entity/quiz");
// import ActionType = require("../../common/action-type");
// /**
//  * Created by <yuemenglong@126.com> on 2017/7/27
//  */
//
// class QuizClass {
//     data: QuizData = new QuizData;
//
//     //noinspection JSMethodCanBeStatic
//     ensureInfo(question: QuizQuestion): void {
//         let state = store.getState();
//         // 已经有了
//         if (question.info) {
//             store.dispatch(ActionCreator.setQuizData({question}));
//         } else if (state.questions[question.infoId]) {
//             // 缓存里有，直接拼上
//             question = _.defaults({info: state.questions[question.infoId]}, question);
//             store.dispatch(ActionCreator.setQuizData({question}))
//         } else {
//             // 缓存里也没有，先拉到缓存里
//             store.dispatch(ActionCreator.fetchQuestion(question.infoId, q => {
//                 question = _.defaults({info: q}, question);
//                 store.dispatch(ActionCreator.setQuizData({question}))
//             }));
//         }
//     }
//
//     getQuestion(quiz: Quiz): QuizQuestion {
//         let mode = quiz.mode;
//         let questions = quiz.questions;
//         if (mode == "answer") {
//             return questions.filter(qt => qt.answer == null)[0]
//         } else if (mode == "review") {
//             return questions.filter(qt => qt.correct == false && qt.idx > quiz.reviewIdx)[0]
//         } else if (mode == "redo") {
//             return questions.filter(qt => qt.correct == false && qt.idx > quiz.answerIdx)[0]
//         } else if (mode == "study") {
//             return questions.filter(qt => qt.idx > quiz.reviewIdx)[0]
//         } else {
//             throw Error("Unknown Mode");
//         }
//     }
//
//     nextOrResult() {
//         let question = this.getQuestion(this.data.quiz);
//         if (question == null) {
//             wxx.redirectTo(`../result/result`)
//         } else {
//             this.ensureInfo(question);
//         }
//     }
//
//     submitAnswer(answer) {
//         store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
//             this.nextOrResult();
//         }));
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindAnswer(e) {
//         if (["review", "study"].indexOf(this.data.mode) >= 0) {
//             return;
//         }
//         let answer = e.target.dataset.answer;
//         if (!this.data.question.info.multi) {
//             return this.submitAnswer(answer);
//         } else if (this.data.answer.indexOf(answer) >= 0) {
//             // 删掉答案
//             answer = this.data.answer.split("").filter(c => c != answer).join("");
//             store.dispatch(ActionCreator.setQuizData({answer}));
//         } else {
//             // 增加答案
//             answer = this.data.answer + answer;
//             answer = answer.split("").sort().join("");
//             store.dispatch(ActionCreator.setQuizData({answer}));
//         }
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindSkip() {
//         this.submitAnswer("");
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindSubmit() {
//         return this.submitAnswer(this.data.answer)
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindNext() {
//         store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {reviewIdx: this.data.question.idx}, () => {
//             return this.nextOrResult();
//         }));
//         // store.dispatch(ActionCreator.setQuizData({idx: this.data.question.idx}));
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindMark() {
//         store.dispatch(ActionCreator.postMark(this.data.question.id, () => {
//             wxx.showToast("收藏成功");
//         }))
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     bindUnMark() {
//         store.dispatch(ActionCreator.deleteMark(this.data.mark.id, () => {
//             wxx.showToast("取消收藏成功");
//         }))
//     }
//
//     //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
//     bindDebug() {
//         return store.dispatch(ActionCreator.postDebugInfo());
//     }
//
//     //noinspection JSUnusedGlobalSymbols
//     onShow() {
//         store.connect(this, (state: State) => {
//             // quiz是直接从store里拼接的
//             let quizId = state.global.quizId;
//             let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
//             let mode = quiz.mode;
//             let question = this.getQuestion(quiz);
//             let mark = state.user.marks.filter(m => m.infoId == question.id)[0];
//             return _.merge({}, state.quiz, {quiz, mode, mark})
//         });
//         this.nextOrResult();
//     }
//
//     //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
//     onLoad() {
//         let state = store.getState();
//         // quiz一定存在
//         let quizId = state.global.quizId;
//         let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
//         let mode = quiz.mode;
//         let inStudy = state.global.inStudy; // 在学习状态
//         store.dispatch(ActionCreator.setQuizData({quiz, mode, inStudy}));
//     }
// }
//
// Page(new QuizClass());
