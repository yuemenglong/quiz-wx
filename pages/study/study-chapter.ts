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
import Study = require("../../common/entity/study");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class ChapterClass {

    bindChoose(e) {
        let chapter = e.target.dataset.no;
        store.dispatch(ActionCreator.newStudyQuiz(chapter, () => {
            wxx.redirectTo(`./study-answer`)
        }))
    }

    onShow() {
        store.connect(this, (state: State) => {
            let chapters = Array(40).join(" ").split(" ").map((v, i) => {
                return i + 1;
            });
            return {chapters};
        })
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {

    }
}

Page(new ChapterClass());

