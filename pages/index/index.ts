import ActionType = require("../../common/action-type");
import State = require("../../common/state/state");
import WxUser = require("../../common/entity/wx-user");
import kit = require("../../kit/wxx");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import IndexData = require("../../common/state/index");
import _ = require("../../libs/lodash/index");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class IndexClass {
    data: IndexData = new IndexData();

    currentType() {
        let current = null;
        if (this.data.hasStudy) {
            current = "study";
        } else if (this.data.quiz && this.data.quiz.count > 30) {
            current = "exam";
        } else if (this.data.quiz && this.data.quiz.count <= 30) {
            current = "quiz";
        }
        return current;
    }

    needTip(type) {
        let current = this.currentType();
        if (current == type || current == null) {
            return false;
        }
        switch (current) {
            case "study":
                //noinspection JSIgnoredPromiseFromCall
                wxx.showTip("提示", "您当前在学习模式下还有未完成的题目，请前往学习模式");
                break;
            case "quiz":
                //noinspection JSIgnoredPromiseFromCall
                wxx.showTip("提示", "您当前在测验模式下还有未完成的题目，请前往测验模式");
                break;
            case "exam":
                //noinspection JSIgnoredPromiseFromCall
                wxx.showTip("提示", "您当前在模拟考试模式下还有未完成的题目，请前往模拟考试模式");
                break;
        }
        return true;
    }

    //noinspection JSUnusedGlobalSymbols
    bindQuiz() {
        if (this.needTip("quiz")) {
            return;
        }
        // 找到一个没有做完的quiz
        let quiz = store.getState().currentQuiz();
        if (quiz == null) {
            // 没有则建立新quiz
            return store.dispatch(ActionCreator.newQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else if (quiz.questions.length == 0) {
            // 拿到quiz详情
            return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else {
            // quiz存在且有详情信息
            store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
            return wxx.navigateTo(`../quiz/quiz`)
        }
    }

    //noinspection JSUnusedGlobalSymbols
    bindNewStudy() {
        let state = store.getState();
        if (state.user.study.quizId != null) {
            wxx.showModal("提示", "您还有未完成的学习，是否忽略并重新开始新的学习").then((choose) => {
                if (!choose) return;
                store.dispatch(ActionCreator.deleteQuiz(state.user.study.quizId, () => {
                    store.dispatch(ActionCreator.putStudy({quizId: null}, () => {
                        return wxx.navigateTo(`../study/study-chapter`);
                    }));
                }))
            })
        } else {
            return wxx.navigateTo(`../study/study-chapter`);
        }
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindContStudy() {
        let state = store.getState();
        let quiz = state.studyQuiz();
        if (quiz.mode == "study") {
            wxx.navigateTo(`../study/study-answer`)
        } else if (quiz.mode == "redo") {
            wxx.navigateTo(`../study/study-redo`)
        } else {
            throw new Error("Invalid Mode: " + quiz.mode)
        }
    }

    // //noinspection JSUnusedGlobalSymbols
    // bindStudy() {
    //     if (this.needTip("study")) {
    //         return;
    //     }
    //     let state = store.getState();
    //     let study = state.user.study;
    //     if (!study.quizId) {
    //         // 通过chapter页面选择一个章节
    //         return wxx.navigateTo(`../study/study-chapter`);
    //     }
    //     let quiz = state.studyQuiz();
    //     if (quiz.mode == "study") {
    //         wxx.navigateTo(`../study/study-answer`)
    //     } else if (quiz.mode == "redo") {
    //         wxx.navigateTo(`../study/study-redo`)
    //     } else {
    //         throw new Error("Invalid Mode: " + quiz.mode)
    //     }
    // }

    //noinspection JSUnusedGlobalSymbols
    bindExam() {
        if (this.needTip("exam")) {
            return;
        }
        store.dispatch(ActionCreator.setGlobalData({inStudy: false}));
        let quiz = store.getState().currentQuiz();
        if (quiz) {
            store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
        }
        if (quiz && quiz.questions.length) {
            return wxx.navigateTo(`../quiz/quiz`)
        } else if (quiz && !quiz.questions.length) {
            return store.dispatch(ActionCreator.fetchQuiz(quiz.id, () => {
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else {
            return store.dispatch(ActionCreator.newExamQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        }
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindDebug() {
        return store.dispatch(ActionCreator.postDebugInfo());
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state) => {
            let user = state.user;
            let wxUser = state.wxUser;
            let quiz = state.currentQuiz();
            let hasStudy = _.get(state, "user.study.quiz") != null;
            return {user, wxUser, quiz, hasStudy};
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    onLoad() {
        store.dispatch(ActionCreator.fetchUser(() => {
            // 已经更新过data
            // switch (this.currentType()) {
            //     case "study":
            //         wxx.showModal("提示", "还有学习未完成，是否继续").then(res => {
            //             if (res) this.bindStudy()
            //         });
            //         break;
            //     case "exam":
            //         wxx.showModal("提示", "还有模拟考试未完成，是否继续").then(res => {
            //             if (res) this.bindExam()
            //         });
            //         break;
            //     case "quiz":
            //         wxx.showModal("提示", "还有测验未完成，是否继续").then(res => {
            //             if (res) this.bindQuiz()
            //         });
            //         break;
            // }
        }))
    }
}

Page(new IndexClass());
