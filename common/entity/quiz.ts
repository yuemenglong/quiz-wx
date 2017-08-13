import User = require("./user");
import QuizQuestion = require("./quiz-question");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */


class Quiz {
    id: number;
    createTime: any;
    questions: Array<QuizQuestion>;
    count: number;

    finished: boolean;

    mode: string;
    tag: string;// study quiz exam mark
    reviewIdx: number;
    answerIdx: number;

    user: User;
    userId: number;
}

module.exports = Quiz;
export =Quiz

