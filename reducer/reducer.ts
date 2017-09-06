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
import Quiz = require("../common/entity/quiz");
import _ = require("../libs/lodash/index");


function go(state: State, action: Action) {
    switch (action.type) {
        case ActionType.SET_WX_USER_INFO: {
            let user = {wxUserInfo: action.data};
            return op.update(state, "user{}", [], user);
        }
        case ActionType.FETCH_USER_SUCC: {
            let user = action.data;
            if (user) {
                return op.update(state, "user{}", [], user);
            } else {
                wxx.setLocalStorage("code", null);
                return state;
            }
        }
        case ActionType.REGIST_USER_SUCC: {
            let user = action.data as User;
            if (user) {
                wxx.setLocalStorage("code", user.code);
                return op.update(state, "user", [], user);
            } else {
                return state;
            }
        }
        case ActionType.NEW_QUIZ_SUCC: {
            let q = action.data as Quiz;
            let [study, quiz, marked] = [null, null, null];
            switch (q.tag) {
                case "study":
                    study = q;
                    break;
                case "quiz":
                    quiz = q;
                    break;
                case "marked":
                    marked = q;
                    break;
            }
            return op.update(state, "user{}", [], {study, quiz, marked})
        }
        case ActionType.CHANGE_ANSWER: {
            let answer = action.data;
            return op.update(state, "quizData.answer", [], answer);
        }
        case ActionType.FETCH_QUESTION_SUCC: {
            let question = action.data;
            return op.update(state, "questions[$idx]", [question.id], question)
        }
        case ActionType.PUT_QUIZ_QUESTION_SUCC: {
            let question = action.data;
            if (state.user.study) {
                return op.updates("user.study.questions[id]", [question.id], question)
                    .update("user.study.idx", [question.quizId], question.idx)
                    .update("quizData.answer", [], "")
                    .call(state);
            } else if (state.user.quiz) {
                return op.updates("user.quiz.questions[id]", [question.id], question)
                    .update("user.quiz.idx", [question.quizId], question.idx)
                    .update("quizData.answer", [], "")
                    .call(state);
            } else if (state.user.marked) {
                return op.updates("user.marked.questions[id]", [question.id], question)
                    .update("user.marked.idx", [question.quizId], question.idx)
                    .update("quizData.answer", [], "")
                    .call(state);
            } else {
                throw new Error("Unreachable")
            }
        }
        case ActionType.MERGE_ANSWER: {
            let {qtId, answer} = action.data;
            if (state.user.study) {
                return op.update(state, "user.study.questions[id].answer",
                    [qtId], answer);
            } else if (state.user.quiz) {
                return op.update(state, "user.quiz.questions[id].answer",
                    [qtId], answer);
            } else if (state.user.marked) {
                return op.update(state, "user.marked.questions[id].answer",
                    [qtId], answer);
            } else {
                throw new Error("Unreachable")
            }
        }
        case ActionType.SET_QUIZ_DATA: {
            return op.update(state, "quizData{}", [], action.data);
        }
        case ActionType.PUT_QUIZ_SUCC: {
            let quiz = action.data;
            if (state.user.study) {
                return op.update(state, "user.study{}", [], quiz);
            } else if (state.user.quiz) {
                return op.update(state, "user.quiz{}", [], quiz);
            } else if (state.user.marked) {
                return op.update(state, "user.marked{}", [], quiz);
            } else {
                throw new Error("Unreachable")
            }
        }
        case ActionType.POST_MARK_SUCC: {
            let mark = action.data;
            return op.update(state, "user.marks[]", [], mark)
        }
        case ActionType.DELETE_MARK_SUCC: {
            let markId = action.data;
            return op.update(state, "user.marks[-id]", [markId], null)
        }
        case ActionType.DELETE_QUIZ_SUCC: {
            let [study, quiz, marked] = [null, null, null];
            return op.update(state, "user{}", [], {study, quiz, marked});
        }
        case ActionType.CLEAR_UNCORRECT_ANSWER_SUCC: {
            let quiz = _.cloneDeep(action.data) as Quiz;
            quiz.questions.map(q => {
                if (q.correct == false) {
                    q.answer = ""
                }
            });
            if (state.user.study) {
                return op.update(state, "user.study{}", [], quiz);
            } else if (state.user.quiz) {
                return op.update(state, "user.quiz{}", [], quiz);
            } else if (state.user.marked) {
                return op.update(state, "user.marked{}", [], quiz);
            } else {
                throw new Error("Unreachable")
            }
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
