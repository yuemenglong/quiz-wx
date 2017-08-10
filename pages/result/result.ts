import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import kit = require("../../kit/kit");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import ResultData = require("../../common/state/result");
/**
 * Created by Administrator on 2017/7/27
 */

class ResultClass {
    data: ResultData = new ResultData;

    // answer / redo -> answer
    bindContQuiz() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {answered: true, corrected: true}, () => {
            let quiz = store.getState().user.quizs.find(q => !q.answered || !q.corrected);
            if (quiz) {
                store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
                wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
            } else {
                store.dispatch(ActionCreator.newQuiz(quiz => {
                    store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
                    wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
                }))
            }
        }));
    }

    // answer / redo -> study
    bindContStudy() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {answered: true, corrected: true}, () => {
            store.dispatch(ActionCreator.newStudyQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
                wxx.redirectTo(`../quiz/quiz`)
            }))
        }));
    }

    // answer / redo -> review
    bindReview() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "review", reviewIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    // review -> redo
    bindRedo() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "redo", answerIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    // study -> answer
    bindAnswer() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {mode: "answer", answerIdx: 0}, () => {
            wxx.redirectTo(`../quiz/quiz`)
        }));
    }

    // onUpdate(data, dispatch) {
    //     if (data.type == "study" && data.fail == 0 && data.updating == false) {
    //         // 更新study
    //         let studyIdx = data.quiz.questions.slice(-1)[0].id;
    //         dispatch(ActionCreator.setResultData({updating: true}));
    //         dispatch(ActionCreator.putStudy({studyIdx}, () => {
    //             dispatch(ActionCreator.setResultData({updating: false}));
    //         }))
    //     }
    // }

    onLoad() {
        let state = store.getState();
        let quizId = state.global.quizId;
        let quiz = state.user.quizs.filter(q => q.id == quizId)[0];

        let fail = quiz.questions.filter(q => q.correct == false).length;
        let inStudy = state.global.inStudy;
        if (fail == 0) {
            // 测验完成
            store.dispatch(ActionCreator.putQuiz(quizId, {answered: true, corrected: true}, () => {
            }));
        }
        if (fail == 0 && inStudy) {
            // 完成本次study
            let studyIdx = quiz.questions.slice(-1)[0].infoId;
            store.dispatch(ActionCreator.putStudy({studyIdx, quizId: null}, () => {
            }));
        }
    }

    onShow() {
        WxRedux.connect(this, (state: State) => {
            let quizId = state.global.quizId;
            let quiz = state.user.quizs.filter(q => q.id == quizId)[0];
            let mode = quiz.mode;
            let inStudy = state.global.inStudy;
            let fail = quiz.questions.filter(q => q.correct == false).length;
            let succ = quiz.questions.filter(q => q.correct == true).length;
            return _.merge({}, state.result, {quiz, fail, succ, mode, inStudy});
        })
    }
}

Page(new ResultClass());

// Page({
//     data: {
//         quizId: null,
//         mode: null,
//
//         quiz: null,
//         fail: null,
//         succ: null,
//     },
//     bindCont: function () {
//         let type = this.data.type;
//         if (type == "study") {
//             //1. study type
//         } else if (type == "quiz") {
//             //2. quiz type
//             let quiz = store.getState().user.quizs.find(q => !q.answered || !q.corrected);
//             if (quiz) {
//                 wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
//             } else {
//                 store.dispatch(ActionCreator.newQuiz(quiz => {
//                     wxx.redirectTo(`../quiz/quiz?id=${quiz.id}`)
//                 }))
//             }
//         }
//     },
//     bindReview: function () {
//         store.dispatch(ActionCreator.putQuiz(this.data.quizId, {phase: "review", reviewIdx: 0}, () => {
//             let type = this.data.type;
//             wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=review&type=${type}`)
//         }));
//     },
//     bindRedo: function () {
//         store.dispatch(ActionCreator.putQuiz(this.data.quizId, {phase: "redo", answerIdx: 0}, () => {
//             let type = this.data.type;
//             wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=redo&type=${type}`)
//         }));
//     },
//     bindAnswer: function () {
//         let type = this.data.type;
//         wxx.redirectTo(`../quiz/quiz?id=${this.data.quiz.id}&mode=answer&type=${type}`)
//     },
//     onUpdate: function (data, dispatch) {
//         if (data.type == "study" && data.fail == 0 && data.updating == false) {
//             // 更新study
//             let studyIdx = data.quiz.questions.slice(-1)[0].id;
//             dispatch(ActionCreator.setResultData({updating: true}));
//             dispatch(ActionCreator.putStudy(studyIdx, () => {
//                 dispatch(ActionCreator.setResultData({updating: false}));
//             }))
//         }
//     },
//     onLoad: function (query) {
//         let quizId = query.id;
//         let quiz = store.getState().user.quizs.filter(quiz => quiz.id == quizId)[0];
//         let mode = quiz.mode;
//         store.dispatch(ActionCreator.setResultData({quizId, quiz, mode}))
//     },
//     onShow: function () {
//         WxRedux.connect(this, (state: State) => {
//             let quiz = state.user.quizs.filter(quiz => quiz.id == state.result.quizId)[0];
//             let fail = quiz.questions.filter(q => q.correct == false).length;
//             let succ = quiz.questions.filter(q => q.correct == true).length;
//             return _.merge({quiz, fail, succ}, state.result);
//         })
//     }
// });

