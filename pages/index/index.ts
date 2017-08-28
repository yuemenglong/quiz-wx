import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import User = require("../../common/entity/user");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

interface IndexData {
    user: User;
}

class IndexClass {
    data: IndexData;

    currentType() {
        if (this.data.user.study) {
            return "study"
        } else if (this.data.user.quiz) {
            return "quiz"
        } else if (this.data.user.marked) {
            return "marked"
        }
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
            case "marked":
                //noinspection JSIgnoredPromiseFromCall
                wxx.showTip("提示", "您当前在模拟考试模式下还有未完成的题目，请前往模拟考试模式");
                break;
        }
        return true;
    }

    //noinspection JSUnusedGlobalSymbols
    bindQuiz() {
        // if (this.needTip("quiz")) {
        //     return;
        // }
        // // 找到一个没有做完的quiz
        // let quiz = store.getState().currentQuiz();
        // if (quiz == null) {
        //     // 没有则建立新quiz
        //     return store.dispatch(ActionCreator.newQuiz(quiz => {
        //         store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
        //         return wxx.navigateTo(`../quiz/quiz`)
        //     }))
        // } else if (quiz.questions.length == 0) {
        //     // 拿到quiz详情
        //     return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
        //         store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
        //         return wxx.navigateTo(`../quiz/quiz`)
        //     }))
        // } else {
        //     // quiz存在且有详情信息
        //     store.dispatch(ActionCreator.setGlobalData({inStudy: false, quizId: quiz.id}));
        //     return wxx.navigateTo(`../quiz/quiz`)
        // }
    }

    //noinspection JSUnusedGlobalSymbols
    bindNewStudy() {
        console.log("bindNewStudy");
        let state = store.getState();
        if (state.user.study != null) {
            wxx.showModal("提示", "您还有未完成的学习，是否忽略并重新开始新的学习").then((choose) => {
                if (!choose) return;
                store.dispatch(ActionCreator.deleteQuiz(state.user.study, () => {
                    return wxx.navigateTo(`../study/study-chapter`);
                }))
            })
        } else {
            return wxx.navigateTo(`../study/study-chapter`);
        }
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindContStudy() {
        let state = store.getState();
        let quiz = state.user.study;
        if (quiz.mode == "study") {
            wxx.navigateTo(`../study/study-answer`)
        } else if (quiz.mode == "redo") {
            wxx.navigateTo(`../study/study-redo`)
        } else {
            throw new Error("Invalid Mode: " + quiz.mode)
        }
    }

    //noinspection JSUnusedGlobalSymbols
    bindExam() {
        if (this.needTip("exam")) {
            return;
        }
        // store.dispatch(ActionCreator.setGlobalData({inStudy: false}));
        // let quiz = store.getState().currentQuiz();
        // if (quiz) {
        //     store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
        // }
        // if (quiz && quiz.questions.length) {
        //     return wxx.navigateTo(`../quiz/quiz`)
        // } else if (quiz && !quiz.questions.length) {
        //     return store.dispatch(ActionCreator.fetchQuiz(quiz.id, () => {
        //         return wxx.navigateTo(`../quiz/quiz`)
        //     }))
        // } else {
        //     return store.dispatch(ActionCreator.newExamQuiz(quiz => {
        //         store.dispatch(ActionCreator.setGlobalData({quizId: quiz.id}));
        //         return wxx.navigateTo(`../quiz/quiz`)
        //     }))
        // }
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindDebug() {
        return store.dispatch(ActionCreator.postDebugInfo());
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state) => {
            let user = state.user;
            return {user: user}
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    onLoad() {
        // 先拿code
        let code = wxx.getLocalStorage("code");
        if (!code) {
            // 未注册，先注册
            wxx.getUserInfo().then(wxUserInfo => {
                store.dispatch(ActionCreator.registUser(wxUserInfo, () => {
                }))
            })
        } else {
            // 注册过，拿用户信息
            store.dispatch(ActionCreator.fetchUser(code, () => {
            }))
        }
    }
}

Page(new IndexClass());
