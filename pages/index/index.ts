import ActionType = require("../../common/action-type");
import WxRedux = require("../../libs/wx-redux/index");
import State = require("../../common/state/state");
import WxUser = require("../../common/entity/wx-user");
import kit = require("../../kit/wxx");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import IndexData = require("../../common/state/index");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class IndexClass {
    data: IndexData = new IndexData();

    //noinspection JSUnusedGlobalSymbols
    bindQuiz() {
        if (this.data.inStudy) {
            return wxx.showTip("提示", "您当前在学习模式下还有未完成的题目，请前往学习模式");
        }
        // 找到一个没有做完的quiz
        let quiz = this.data.user.quizs.find(quiz => {
            return quiz.answered != true || quiz.corrected != true
        });
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
        if (!this.data.inStudy && this.data.quiz) {
            return wxx.showTip("提示", "您当前在测验模式下还有未完成的题目，请前往测验模式")
        }
        store.dispatch(ActionCreator.setGlobalData({inStudy: true}));
        let quiz = this.data.user.study.quiz;
        if (quiz != null && quiz.questions.length > 0) {
            // 有quiz，quiz里有questions
            store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
            return wxx.navigateTo(`../quiz/quiz`)
        } else if (quiz != null && quiz.questions.length == 0) {
            // 有quiz，quiz里没有question
            return store.dispatch(ActionCreator.fetchQuiz(quiz.id, (quiz) => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
                return wxx.navigateTo(`../quiz/quiz`)
            }))
        } else {
            // 没有quiz
            return store.dispatch(ActionCreator.newStudyQuiz(quiz => {
                store.dispatch(ActionCreator.setGlobalData({inStudy: true, quizId: quiz.id}));
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
            let quiz = user.quizs.filter(q => !q.answered || !q.corrected)[0];
            let inStudy = user.study.quiz != null;
            return {user, wxUser, quiz, inStudy};
        });
    }

    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    onLoad() {
        store.dispatch(ActionCreator.fetchUser(() => {
            let state = store.getState();
            let quiz = state.user.quizs.filter(q => !q.answered || !q.corrected)[0];
            let inStudy = state.user.study.quiz != null;
            if (inStudy) {
                wxx.showModal("提示", "还有学习未完成，是否继续").then(res => {
                    if (res) {
                        this.bindStudy()
                    }
                })
            } else if (quiz) {
                wxx.showModal("提示", "还有测试未完成，是否继续").then(res => {
                    if (res) {
                        this.bindQuiz()
                    }
                })
            }
        }))
    }
}

Page(new IndexClass());
