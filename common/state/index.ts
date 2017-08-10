import Quiz = require("../entity/quiz");
import Question = require("../entity/question");
import QuizQuestion = require("../entity/quiz-question");
import User = require("../entity/user");
import WxUser = require("../entity/wx-user");
/**
 * Created by yml on 2017/8/6.
 */

class IndexData {
    user: User;
    wxUser: WxUser;
    quiz: Quiz;
    inStudy: boolean;
}

module.exports = IndexData;
export =IndexData;

