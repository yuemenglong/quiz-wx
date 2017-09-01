import QestionPage = require("../base/question-page");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

abstract class MarkedBaseClass extends QestionPage {
    submitAnswer(answer) {
        // 提交答案
        let question = this.data.question;
        let correctAnswer = this.getCorrectAnswer(question);
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

    gotoResult() {
        wxx.redirectTo(`./marked-result`)
    }
}

module.exports = MarkedBaseClass;
export = MarkedBaseClass;
