/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

import ActionType = require("../common/action-type")
import {Action} from "../common/interface";
import WxUser = require("../common/entity/wx-user");
import _ = require("../libs/lodash/index");
import QuizQuestion = require("../common/entity/quiz-question");
import kit = require("../kit/kit");


function go(state, action) {
    switch (action.type) {
        case ActionType.FETCH_WX_USER_SUCC:
            let wxUser = action.data;
            return _.defaults({wxUser}, state);
        case ActionType.FETCH_USER_SUCC:
            let user = action.data;
            return _.defaults({user}, state);
        case ActionType.REGIST_USER_SUCC:
            user = action.data;
            return _.defaults({user}, action.data);
        case ActionType.NEW_QUIZ_SUCC:
            let quiz = action.data;
            let quizs = state.user.quizs.concat([quiz]);
            user = _.defaults({quizs}, state.user);
            return _.defaults({user}, state);
        case ActionType.FETCH_QUIZ_SUCC: {
            let quiz = action.data;
            return kit.update(state, "user.quizs[id]", [quiz.id], quiz);
        }
        case ActionType.FETCH_QUESTION_SUCC: {
            let question = action.data;
            return kit.update(state, "questions[$idx]", [question.id], question)
        }
        case ActionType.PUT_ANSWER_SUCC: {
            let question = action.data;
            return kit.update(state, "user.quizs[id].questions[id]",
                [question.quizId, question.id], question);
        }
        default:
            return state;
    }
}

function reducer(state: Object, action: Action): Object {
    console.log(state, action);
    let ret = go(state, action);
    console.log(ret);
    return ret
}


module.exports = reducer;
export =reducer;
