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
import kit = require("../../kit/kit");
import Study = require("../../common/entity/study");
import Mark = require("../../common/entity/mark");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class QuestionData {
    quiz: Quiz;
    question: QuizQuestion;
    answer: string = "";
    mark: Mark = null;
    isFirst: boolean = false;
    isLast: boolean = false;

    a: String = null;
    b: String = null;
    c: String = null;
    d: String = null;
}

function getCorrectAnswer(qq: QuizQuestion): string {
    return qq.info.answer.split("").map(c => {
        return "abcd".charAt(qq.seq.indexOf(c))
    }).sort().join("")
}

function getQuizQuestion(qq: QuizQuestion, no: string): string {
    if (!qq.info) {
        return null;
    }
    let infoNo = qq.seq.charAt("abcd".indexOf(no));
    switch (infoNo) {
        case 'a' :
            return qq.info.a;
        case 'b' :
            return qq.info.b;
        case 'c' :
            return qq.info.c;
        case 'd' :
            return qq.info.d;
    }
}

abstract class QuestionPage {
    data: QuestionData = new QuestionData;

    nextOrResult() {
        let state = store.getState();
        let quizId = state.user.study.quizId;
        let quiz = state.user.quizs.filter(q => q.id = quizId)[0];
        let question = this.getNextQuestion(quiz);
        if (!question) {
            // 做完了
            wxx.redirectTo(`./study-result`)
        } else {
            // 下一题目
            kit.ensureInfo(question)
        }
    }

    abstract getNextQuestion(quiz: Quiz): QuizQuestion

    submitAnswer(answer) {
        // 提交答案
        let question = this.data.question;
        let info = store.getState().questions[question.infoId];
        let correctAnswer = getCorrectAnswer(question);
        if (answer == correctAnswer) {
            store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
                this.nextOrResult();
            }));
        } else {
            let answerDetail = correctAnswer.split("").map(no => {
                return `${no.toUpperCase()}.${this.data[no]}`;
            }).join("\n");
            wxx.showTip("回答错误", `正确答案：\n${answerDetail}`).then(() => {
                store.dispatch(ActionCreator.putAnswer(this.data.quiz.id, this.data.question.id, answer, () => {
                    this.nextOrResult();
                }));
            })
        }
    }

    //noinspection JSUnusedGlobalSymbols
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

    //noinspection JSUnusedGlobalSymbols
    bindSubmit() {
        return this.submitAnswer(this.data.answer)
    }

    //noinspection JSUnusedGlobalSymbols
    bindPrev() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {answerIdx: this.data.question.idx - 2}, () => {
            return this.nextOrResult()
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    bindNext() {
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {answerIdx: this.data.question.idx}, () => {
            return this.nextOrResult();
        }));
        // store.dispatch(ActionCreator.setQuizData({idx: this.data.question.idx}));
    }

    //noinspection JSUnusedGlobalSymbols
    bindMark() {
        store.dispatch(ActionCreator.postMark(this.data.question.infoId, () => {
            wxx.showToast("收藏成功");
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    bindUnMark() {
        store.dispatch(ActionCreator.deleteMark(this.data.mark.id, () => {
            wxx.showToast("取消收藏成功");
        }))
    }

    // //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    // bindDebug() {
    //     return store.dispatch(ActionCreator.postDebugInfo());
    // }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new QuestionData;
            let quizId = state.user.study.quizId;
            data.quiz = state.user.quizs.filter(q => q.id = quizId)[0];
            data.question = this.getNextQuestion(data.quiz);
            if (data.question) {
                data.question.info = state.questions[data.question.infoId];
                data.a = getQuizQuestion(data.question, "a");
                data.b = getQuizQuestion(data.question, "b");
                data.c = getQuizQuestion(data.question, "c");
                data.d = getQuizQuestion(data.question, "d");
                data.mark = state.user.marks.filter(m => m.infoId == data.question.infoId)[0] || null;
            }
            data.isFirst = data.quiz.answerIdx == 0;
            data.isLast = data.quiz.answerIdx >= data.quiz.questions.length - 1;
            data.answer = state.quiz.answer;
            return _.merge({}, this.data, data)
        });
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {
        let state = store.getState();
        let quizId = state.user.study.quizId;
        let quiz = state.user.quizs.filter(q => q.id = quizId)[0];
        if (quiz.questions.length == 0) {
            store.dispatch(ActionCreator.fetchQuiz(quiz.id, () => {
                this.nextOrResult();
            }))
        } else {
            this.nextOrResult();
        }
    }
}
module.exports = QuestionPage;
export =QuestionPage;

