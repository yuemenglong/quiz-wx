import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import User = require("../../common/entity/user");
import State = require("../../common/state/state");
import moment = require("../../libs/moment/index");

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
    needStopCurrent(): Promise<boolean> {
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
        this.needStopCurrent().then((choose) => {
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
        this.needStopCurrent().then((choose) => {
            if (!choose) return;
            return store.dispatch(ActionCreator.newQuiz(() => {
                store.dispatch(ActionCreator.setQuizData({startTime: new Date().valueOf()}));
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

    //noinspection JSUnusedGlobalSymbols
    bindNewMarked() {
        let state = store.getState();
        if (state.user.marks.length == 0) {
            return wxx.showTip("提示", "您还没有标记易错题，请标记后再进行易错题回顾")
        }
        this.needStopCurrent().then((choose) => {
            if (!choose) return;
            return store.dispatch(ActionCreator.newMarkedQuiz(() => {
                return wxx.navigateTo(`../marked/marked-answer`);
            }))
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    bindContMarked() {
        let state = store.getState();
        let quiz = state.user.marked;
        if (quiz.mode == "study") {
            wxx.navigateTo(`../marked/marked-answer`)
        } else if (quiz.mode == "redo") {
            wxx.navigateTo(`../marked/marked-redo`)
        } else {
            throw new Error("Invalid Mode: " + quiz.mode)
        }
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
            // 之后改成通过注册码判断是否注册 //TODO
            wxx.getUserInfo().then(wxUserInfo => {
                store.dispatch(ActionCreator.registUser(wxUserInfo, () => {
                }))
            })
        } else {
            // 注册过，拿用户信息
            store.dispatch(ActionCreator.fetchUser(code, (user: User) => {
                if (user == null) {
                    wxx.getUserInfo().then(wxUserInfo => {
                        store.dispatch(ActionCreator.registUser(wxUserInfo, () => {
                        }))
                    })
                }
            }))
        }
    }
}

Page(
    new

    IndexClass()
);
