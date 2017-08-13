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
import StudyData = require("../../common/state/study");
import kit = require("../../kit/kit");
import StudyClass = require("./study");
import Study = require("../../common/entity/study");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class StudyAnswerClass extends StudyClass {
    getNextQuestion(quiz: Quiz): QuizQuestion {
        return quiz.questions[quiz.answerIdx]
    }
}

Page(new StudyAnswerClass());

