/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

import ActionType = require("../common/action-type")
import {Action} from "../common/interface";
import op = require("../kit/op");
import State = require("../common/state/state");
import debug = require("../kit/debug");
import User = require("../common/entity/user");
import wxx = require("../kit/wxx");


function go(state: State, action: Action) {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCC: {
            let user = action.data;
            return op.update(state, "user", [], user);
        }
        case ActionType.REGIST_USER_SUCC: {
            let user = action.data as User;
            wxx.setLocalStorage("code", user.code);
            return op.update(state, "user", [], user);
        }
        case ActionType.NEW_QUIZ_SUCC: {
            let quiz = action.data;
            return op.update(state, "user.quizs[]", [], quiz)
        }
        case ActionType.CHANGE_ANSWER: {
            let answer = action.data;
            return op.update(state, "quiz.answer", [], answer);
        }
        case ActionType.FETCH_QUESTION_SUCC: {
            let question = action.data;
            return op.update(state, "questions[$idx]", [question.id], question)
        }
        case ActionType.PUT_QUIZ_QUESTION_SUCC: {
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
        case ActionType.PUT_QUIZ_SUCC: {
            let quiz = action.data;
            return op.update(state, "user.quizs[id]{}", [quiz.id], quiz);
        }
        case ActionType.POST_MARK_SUCC: {
            let mark = action.data;
            return op.update(state, "user.marks[]", [], mark)
        }
        case ActionType.DELETE_MARK_SUCC: {
            let markId = action.data;
            return op.update(state, "user.marks[-id]", [markId], null)
        }
        case ActionType.DELETE_QUIZ_QUESTION_SUCC: {
            let {quizId, qtId} = action.data;
            return op.update(state, "user.quizs[id].questions[-id]", [quizId, qtId], null);
        }
        case ActionType.DELETE_QUIZ_SUCC: {
            let quizId = action.data;
            return op.update(state, "user.quizs[-id]", [quizId], null);
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
export = reducer;
