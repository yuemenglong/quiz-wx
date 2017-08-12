/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

import ActionType = require("../common/action-type")
import {Action} from "../common/interface";
import WxUser = require("../common/entity/wx-user");
import _ = require("../libs/lodash/index");
import QuizQuestion = require("../common/entity/quiz-question");
import op = require("../kit/op");
import State = require("../common/state/state");
import debug = require("../kit/debug");
import Quiz = require("../common/entity/quiz");


function go(state: State, action: Action) {
    switch (action.type) {
        case ActionType.FETCH_WX_USER_SUCC: {
            let wxUser = action.data;
            return _.defaults({wxUser}, state);
        }
        case ActionType.FETCH_USER_SUCC: {
            let user = action.data;
            return _.defaults({user}, state);
        }
        case ActionType.REGIST_USER_SUCC: {
            let user = action.data;
            return _.defaults({user}, state);
        }
        case ActionType.NEW_QUIZ_SUCC: {
            let quiz = action.data;
            return op.update(state, "user.quizs[]", [], quiz)
        }
        case ActionType.FETCH_QUIZ_SUCC: {
            let quiz = action.data;
            return op.update(state, "user.quizs[id]", [quiz.id], quiz);
        }
        case ActionType.CHANGE_ANSWER: {
            let answer = action.data;
            return op.update(state, "quiz.answer", [], answer);
        }
        case ActionType.FETCH_QUESTION_SUCC: {
            let question = action.data;
            return op.update(state, "questions[$idx]", [question.id], question)
        }
        case ActionType.PUT_ANSWER_SUCC: {
            let question = action.data;
            return op.updates("user.quizs[id].questions[id]", [question.quizId, question.id], question)
                .update("user.quizs[id].answerIdx", [question.quizId], question.idx)
                .update("quiz.answer", [], "")
                .call(state);
        }
        case ActionType.MERGE_ANSWER: {
            let {qzId, qtId, answer} = action.data;
            return op.update(state, "user.quizs[id].questions[id].answer",
                [qzId, qtId], answer);
        }
        case ActionType.SET_QUIZ_DATA: {
            return op.update(state, "quiz{}", [], action.data);
        }
        case ActionType.SET_RESULT_DATA: {
            return op.update(state, "result{}", [], action.data);
        }
        case ActionType.PUT_QUIZ_SUCC: {
            let quiz = action.data;
            delete quiz.questions; // TODO
            return op.update(state, "user.quizs[id]{}", [quiz.id], quiz);
        }
        case ActionType.PUT_STUDY_SUCC: {
            let study = action.data;
            let quiz = state.user.quizs.filter(q => q.id == study.quizId)[0] || null;
            study = _.merge({quiz}, study);
            return op.update(state, "user.study{}", [], study);
        }
        case ActionType.SET_GLOBAL_DATA: {
            let global = action.data;
            return op.update(state, "global{}", [], global);
        }
        case ActionType.POST_MARK_SUCC: {
            let mark = action.data;
            return op.update(state, "user.marks[]", [], mark)
        }
        case ActionType.DELETE_MARK_SUCC: {
            let markId = action.data;
            return op.update(state, "user.marks[-id]", [markId], null)
        }
        case ActionType.NEW_STUDY_QUIZ_SUCC: {
            let quiz = action.data as Quiz;
            return op.updates("user.quizs[]", [], quiz)
                .update("user.study.quizId", [], quiz.id)
                .call(state)
        }
        case ActionType.NEW_QUIZ_QUESTION_SUCC: {
            let question = action.data;
            return op.update(state, "user.quizs[id].questions[]", [question.quizId], question)
        }
        default:
            return state;
    }
}

function reducer(state: State, action: Action): Object {
    debug("Before", state, action);
    let next = go(state, action);
    debug("After", next, action);
    return next
}


module.exports = reducer;
export =reducer;
