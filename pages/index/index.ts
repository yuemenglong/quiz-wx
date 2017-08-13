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
    bindStudy() {
        if (this.needTip("study")) {
            return;
        }
        if (!store.state.hasMoreStudy()) {
            wxx.showModal("提示", "您已完成学习，是否开始新一轮学习?").then(function (value) {
                if (!value) return;
                store.dispatch(ActionCreator.putStudy({studyIdx: 0}, go));
            })
        }
        else {
            go();
        }

        function go() {
            let study = store.getState().user.study;
            if (!study.quizId) {
                // 通过chapter页面选择一个章节
                wxx.navigateTo(`../chapter/chapter`);
                // // new一个quiz
                // store.dispatch(ActionCreator.newStudyQuiz(quiz => {
                //     wxx.navigateTo(`../study/study`)
                // }))
            } else {
                // 直接跳转到study页面
                wxx.navigateTo(`../study/study`)
            }
            // let quiz = store.getState().user.study.quiz;
            // quiz模式：1. study 2. answer 3. review 4. redo
            // 1. study情况下quiz是逐渐append上的

            // if (quiz != null && quiz.questions.length > 0) {
            //     // 有quiz，quiz里有questions
            //     store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
            //     return wxx.navigateTo(`../quiz/quiz`)
            // } else if (quiz != null && quiz.questions.length == 0) {
            //     // 有quiz，quiz里没有question
            //     return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
            //         store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
            //         return wxx.navigateTo(`../quiz/quiz`)
            //     }))
            // } else {
            //     // 没有quiz
            //     return store.dispatch(ActionCreator.newStudyQuiz(quiz => {
            //         store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
            //         return wxx.navigateTo(`../quiz/quiz`)
            //     }))
            // }
        }
    }

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
            let quiz = _.get(state, "user.quizs", []).filter(q => !q.answered || !q.corrected)[0];
            let hasStudy = _.get(state, "user.study.quiz") != null;
            return {user, wxUser, quiz, hasStudy};
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    onLoad() {
        store.dispatch(ActionCreator.fetchUser(() => {
            // 已经更新过data
            switch (this.currentType()) {
                case "study":
                    wxx.showModal("提示", "还有学习未完成，是否继续").then(res => {
                        if (res) this.bindStudy()
                    });
                    break;
                case "exam":
                    wxx.showModal("提示", "还有模拟考试未完成，是否继续").then(res => {
                        if (res) this.bindExam()
                    });
                    break;
                case "quiz":
                    wxx.showModal("提示", "还有测验未完成，是否继续").then(res => {
                        if (res) this.bindQuiz()
                    });
                    break;
            }
        }))
    }
}

Page(new IndexClass());
