import Quiz = require("./quiz");
import Study = require("./study");
/**
 * Created by Administrator on 2017/7/27.
 */

class User {

    id: number;
    wxId: string;

    study: Study;
    quizs: Array<Quiz>;
}

module.exports = User;
export = User