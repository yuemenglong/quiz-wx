import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import User = require("../../common/entity/user");
import State = require("../../common/state/state");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class IndexData {
    user: User;
    current: string;
}

class IndexClass {
    data: IndexData;

    // noinspection JSMethodCanBeStatic
    currentType(state: State): string {
        if (!state.user) {
            return ""
        }
        if (state.user.study) {
            return "study"
        } else if (state.user.quiz) {
            return "quiz"
        } else if (state.user.marked) {
            return "marked"
        }
    }

    // noinspection JSMethodCanBeStatic
    stopCurrent(): Promise<boolean> {
        function tip(): Promise<boolean> {
            let state = store.getState();
            if (state.user.study) {
                return wxx.showModal("提示", "您还有未完成的学习，是否忽略")
            } else if (state.user.quiz) {
                return wxx.showModal("提示", "您还有未完成的模拟测试，是否忽略")
            } else if (state.user.marked) {
                return wxx.showModal("提示", "您还有未完成的易错题回顾，是否忽略")
            } else {
                return new Promise((resolve) => {
                    resolve(true)
                })
            }
        }

        return tip().then(choose => {
            if (choose) {
                store.dispatch(ActionCreator.setQuizData({answer: ""}));
            }
            return choose;
        })
    }

    //noinspection JSUnusedGlobalSymbols
    bindNewStudy() {
        this.stopCurrent().then((choose) => {
            if (!choose) return;
            return wxx.navigateTo(`../study/study-chapter`);
        });
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
    bindNewQuiz() {
        this.stopCurrent().then((choose) => {
            if (!choose) return;
            return store.dispatch(ActionCreator.newQuiz(() => {
                return wxx.navigateTo(`../quiz/quiz-answer`);
            }))
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindContQuiz() {
        let state = store.getState();
        let quiz = state.user.quiz;
        if (quiz.mode == "answer") {
            wxx.navigateTo(`../quiz/quiz-answer`)
        } else if (quiz.mode == "review") {
            wxx.navigateTo(`../quiz/quiz-review`)
        } else if (quiz.mode == "redo") {
            wxx.navigateTo(`../quiz/quiz-redo`)
        } else {
            throw new Error("Invalid Mode: " + quiz.mode)
        }
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindDebug() {
        return store.dispatch(ActionCreator.postDebugInfo());
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state) => {
            let data = new IndexData();
            data.user = state.user;
            data.current = this.currentType(state);
            return data;
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

Page(
    new

    IndexClass()
);
