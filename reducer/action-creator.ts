import {Thunk, Dispatch, GetState, Action} from "../common/interface";
import ActionType = require("../common/action-type");
import kit = require("../kit/wxx");
import http = require("../kit/http");
import WxUser = require("../common/entity/wx-user");
import User = require("../common/entity/user");
import Quiz = require("../common/entity/quiz");
/**
 * Created by Administrator on 2017/7/27.
 */

class ActionCreator {
    static fetchUser(): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            new Promise<WxUser>((resolve, reject) => {
                if (getState().wxUser != null) {
                    return resolve(getState().wxUser)
                }
                dispatch({type: ActionType.FETCH_WX_USER, data: null});
                kit.getUserInfo().then(wxUser => {
                    dispatch({type: ActionType.FETCH_WX_USER_SUCC, data: wxUser});
                    resolve(wxUser)
                })
            }).then(wxUser => {
                if (getState().user != null) {
                    return getState().user;
                }
                dispatch({type: ActionType.FETCH_USER, data: null});
                return http.get<User>(`/user?wxId=${wxUser.nickName}`).then(user => {
                    dispatch({type: ActionType.FETCH_USER_SUCC, data: user});
                    return user;
                })
            }).then(user => {
                if (user != null) {
                    return user;
                }
                dispatch({type: ActionType.REGIST_USER, data: null});
                let wxId = getState().wxUser.nickName;
                return http.post<User>(`/user`, {wxId: wxId}).then(user => {
                    dispatch({type: ActionType.REGIST_USER_SUCC, data: user});
                    return user;
                })
            })
        }
    }

    static newQuiz(cb: (quiz: Quiz) => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: null});
            let userId = getState().user.id;
            http.post(`/quiz`, {userId}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz);
            })
        }
    }

    static fetchQuiz(quizId): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.FETCH_QUIZ, data: null});
            http.get(`/quiz/${quizId}`).then(quiz => {
                dispatch({type: ActionType.FETCH_QUIZ_SUCC, data: quiz});
            })
        })
    }

    static fetchQuestion(id: number): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.FETCH_QUESTION, data: null});
            http.get(`/question/${id}`).then(question => {
                dispatch({type: ActionType.FETCH_QUESTION_SUCC, data: question})
            })
        }
    }

    static putAnswer(qzId: number, qtId: number, answer: string): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.PUT_ANSWER, data: null});
            http.put(`/quiz/${qzId}/question/${qtId}`, {answer}).then(question => {
                dispatch({type: ActionType.PUT_ANSWER_SUCC, data: question})
            })
        }
    }

    static reviewNext(idx: number): Action {
        return {type: ActionType.REVIEW_NEXT, data: idx}
    }

    static changeAnswer(answer: string): Action {
        return {type: ActionType.CHANGE_ANSWER, data: answer}

    }

    static initPage(quizId: number, mode: string): Action {
        return {type: ActionType.INIT_QUIZ, data: {quizId, mode}}
    }
}

module.exports = ActionCreator;
export  = ActionCreator;