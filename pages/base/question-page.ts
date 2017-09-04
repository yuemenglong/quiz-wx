import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import QuizQuestion = require("../../common/entity/quiz-question");
import _ = require("../../libs/lodash/index");
import wxx = require("../../kit/wxx");
import Quiz = require("../../common/entity/quiz");
import kit = require("../../kit/kit");
import QuestionData = require("./question-data");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */


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

// TODO redo模式下的上一题
abstract class QuestionPage {
    data: QuestionData = new QuestionData;

    nextOrResult() {
        let state = store.getState();
        let question = this.getNextQuestion(kit.getCurrentQuiz(state.user));
        if (!question) {
            // 做完了
            this.gotoResult();
        } else {
            // 下一题目
            kit.ensureInfo(question)
        }
    }

    getCorrectAnswer(qq: QuizQuestion): string {
        return qq.info.answer.split("").map(c => {
            return "abcd".charAt(qq.seq.indexOf(c))
        }).sort().join("")
    }

    abstract gotoResult()

    abstract getNextQuestion(quiz: Quiz): QuizQuestion

    abstract submitAnswer(answer)

    // noinspection JSMethodCanBeStatic
    dataMapper(data: QuestionData, state: State): QuestionData {
        return data
    }

    //noinspection JSUnusedGlobalSymbols
    bindAnswer(e) {
        let answer = e.target.dataset.answer;
        if (!this.data.question.info.multi) {
            store.dispatch(ActionCreator.setQuizData({answer: ""}));
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
        store.dispatch(ActionCreator.setQuizData({answer: ""}));
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {idx: this.data.question.idx - 2}, () => {
            return this.nextOrResult()
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    bindNext() {
        store.dispatch(ActionCreator.setQuizData({answer: ""}));
        store.dispatch(ActionCreator.putQuiz(this.data.quiz.id, {idx: this.data.question.idx}, () => {
            return this.nextOrResult();
        }));
        // store.dispatch(ActionCreator.setQuizData({idx: this.data.question.idx}));
    }

    //noinspection JSUnusedGlobalSymbols
    bindMark() {
        store.dispatch(ActionCreator.postMark(this.data.question.infoId, () => {
            wxx.toastSucc("收藏成功");
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    bindUnMark() {
        store.dispatch(ActionCreator.deleteMark(this.data.mark.id, () => {
            wxx.toastSucc("取消收藏成功");
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            // quiz是直接从store里拼接的
            let data = new QuestionData;
            data.quiz = kit.getCurrentQuiz(state.user);
            data.question = this.getNextQuestion(data.quiz);
            if (data.question) {
                data.question.info = state.questions[data.question.infoId];
                data.a = getQuizQuestion(data.question, "a");
                data.b = getQuizQuestion(data.question, "b");
                data.c = getQuizQuestion(data.question, "c");
                data.d = getQuizQuestion(data.question, "d");
                data.mark = state.user.marks.filter(m => m.infoId == data.question.infoId)[0] || null;
                if (data.question.info) {
                    data.correctAnswer = this.getCorrectAnswer(data.question);
                }
            }
            data.isFirst = data.quiz.idx == 0;
            data.isLast = data.quiz.idx >= data.quiz.questions.length - 1;
            data.answer = state.quizData.answer;
            return this.dataMapper(_.merge({}, data), state)
        });
    }

    onLoadHook() {

    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {
        this.onLoadHook();
        this.nextOrResult();
    }

    onUnloadHook() {

    }

    onUnload(){
        this.onUnloadHook();
    }
}

module.exports = QuestionPage;
export = QuestionPage;

