import Quiz = require("./quiz");
/**
 * Created by Administrator on 2017/7/27.
 */

class User {

    id: number;
    wxId: string;

    quizs: Array<Quiz>;
}

module.exports = User;
export = User