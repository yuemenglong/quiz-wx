import User = require("./user");
import QuizQuestion = require("./quiz-question");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */


class Quiz {
    id: number;
    createTime: Date;
    questions: Array<QuizQuestion>;
    count: number;
    answered: Boolean;
    corrected: Boolean;
    user: User;
    userId: number;
}

module.exports = Quiz;
export =Quiz

