import Quiz = require("./quiz");
import Mark = require("./mark");
import WxUserInfo = require("./wx-user-info");

/**
 * Created by Administrator on 2017/7/27.
 */

class User {
    id: number;
    code: string;
    wxUserInfo: WxUserInfo;

    study: Quiz;
    quiz: Quiz;
    marked: Quiz;

    marks: Array<Mark>;

    getCurrentQuiz() {
        if (this.study) {
            return this.study
        } else if (this.quiz) {
            return this.quiz
        } else if (this.marked) {
            return this.marked
        } else {
            return null
        }
    }
}

module.exports = User;
export = User