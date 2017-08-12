import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import Question = require("../../common/entity/question");
import QuizQuestion = require("../../common/entity/quiz-question");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import Quiz = require("../../common/entity/quiz");
import QuizData = require("../../common/state/quiz");
import ActionType = require("../../common/action-type");
import StudyData = require("../../common/state/study");
import kit = require("../../kit/kit");
import Study = require("../../common/entity/study");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class StudyClass {
    data: StudyData = new StudyData;

    // getQuestion(quiz: Quiz): QuizQuestion {
    //     let mode = quiz.mode;
    //     let questions = quiz.questions;
    //     if (mode == "answer") {
    //         return questions.filter(qt => qt.answer == null)[0]
    //     } else if (mode == "review") {
    //         return questions.filter(qt => qt.correct == false && qt.idx > quiz.reviewIdx)[0]
    //     } else if (mode == "redo") {
    //         return questions.filter(qt => qt.correct == false && qt.idx > quiz.answerIdx)[0]
    //     } else if (mode == "study") {
    //         return questions.filter(qt => qt.idx > quiz.reviewIdx)[0]
    //     } else {
    //         throw Error("Unknown Mode");
    //     }
    // }
    //
    nextOrResult() {
        // 新增题目 绑定info
        let state = store.getState();
        let quizId = state.user.study.quizId;
        let quiz = state.user.quizs.filter(q => q.id = quizId)[0];
        let question = quiz.questions.slice(-1)[0];
        let infoId = state.user.study.studyIdx + 1;
        let idx = null;
        if (!question) idx = 1;
        else idx = quiz.questions.length + 1;
        store.dispatch(ActionCreator.newQuizQuestion(quizId, idx, infoId, (question) => {
            kit.ensureInfo(question)
        }))

        // let question = this.getQuestion(this.data.quiz);
        // if (question == null) {
        //     wxx.redirectTo(`../result/result`)
        // } else {
        //     this.ensureInfo(question);
        // }
    }

    submitAnswer(answer) {
        // 提交答案
        store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
            // 更新studyIdx
            let study = new Study;
            study.studyIdx = this.data.question.info.id;
            store.dispatch(ActionCreator.putStudy(study, () => {
                this.nextOrResult();

            }));
        }));
    }

    noinspection
    JSUnusedGlobalSymbols

    bindAnswer(e) {
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

    //
    // //noinspection JSUnusedGlobalSymbols
    // bindSkip() {
    //     this.submitAnswer("");
    // }
    //
    // //noinspection JSUnusedGlobalSymbols
    // bindSubmit() {
    //     return this.submitAnswer(this.data.answer)
    // }
    //
    // //noinspection JSUnusedGlobalSymbols
    // bindNext() {
    //     store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {reviewIdx: this.data.question.idx}, () => {
    //         return this.nextOrResult();
    //     }));
    //     // store.dispatch(ActionCreator.setQuizData({idx: this.data.question.idx}));
    // }
    //
    // //noinspection JSUnusedGlobalSymbols
    // bindMark() {
    //     store.dispatch(ActionCreator.postMark(this.data.question.id, () => {
    //         wxx.showToast("收藏成功");
    //     }))
    // }
    //
    // //noinspection JSUnusedGlobalSymbols
    // bindUnMark() {
    //     store.dispatch(ActionCreator.deleteMark(this.data.mark.id, () => {
    //         wxx.showToast("取消收藏成功");
    //     }))
    // }
    //
    // //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    // bindDebug() {
    //     return store.dispatch(ActionCreator.postDebugInfo());
    // }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new StudyData;
            let quizId = state.user.study.quizId;
            data.quiz = state.user.quizs.filter(q => q.id = quizId)[0];
            data.question = data.quiz.questions.slice(-1)[0];
            if (data.question) {
                data.question.info = state.questions[data.question.infoId]
            }
            data.mark = state.user.marks.filter(m => m.infoId == _.get(data, "question.id"))[0];
            return _.merge({}, this.data, data)
        });
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {
        this.nextOrResult();
        // let state = store.getState();
        // let quizId = state.user.study.quizId;
        // let quiz = state.user.quizs.filter(q => q.id = quizId)[0];
        // let question = quiz.questions.slice(-1)[0];
        // let infoId = state.user.study.studyIdx + 1;
        // if (!question) {
        //     store.dispatch(ActionCreator.newQuizQuestion(quizId, 1, infoId, (question) => {
        //         kit.ensureInfo(question)
        //     }))
        // }
    }
}

Page(new StudyClass());

