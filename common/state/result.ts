import Quiz = require("../entity/quiz");
/**
 * Created by yml on 2017/8/6.
 */

class ResultData {
    mode: string;
    type: string;
    quiz: Quiz;

    inStudy: boolean;
}

module.exports = ResultData;
export =ResultData;
