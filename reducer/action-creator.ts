import {Thunk, Dispatch, GetState, Action} from "../common/interface";
import ActionType = require("../common/action-type");
import kit = require("../kit/wxx");
import http = require("../kit/http");
import WxUser = require("../common/entity/wx-user");
import User = require("../common/entity/user");
import Quiz = require("../common/entity/quiz");
import _ = require("../libs/lodash/index");
import Question = require("../common/entity/question");
import Study = require("../common/entity/study");
/**
 * Created by Administrator on 2017/7/27
 */

class ActionCreator {
    static fetchUser(): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            new Promise<WxUser>((resolve) => {
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
                let study = new Study();
                return http.post<User>(`/user`, {wxId: wxId, study}).then(user => {
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
            let mode = "answer";
            http.post(`/quiz`, {userId, mode}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz);
            })
        }
    }

    static fetchQuiz(quizId, cb: (quiz: Quiz) => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.FETCH_QUIZ, data: quizId});
            http.get(`/quiz/${quizId}`).then(quiz => {
                dispatch({type: ActionType.FETCH_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz)
            })
        })
    }

    static fetchQuestion(id: number, cb: (question: Question) => void): Thunk {
        return (dispatch: Dispatch) => {
            dispatch({type: ActionType.FETCH_QUESTION, data: id});
            http.get(`/question/${id}`).then(question => {
                dispatch({type: ActionType.FETCH_QUESTION_SUCC, data: question});
                cb(question as Question)
            })
        }
    }

    static putAnswer(qzId: number, qtId: number, answer: string, cb: () => void): Thunk {
        return (dispatch: Dispatch) => {
            dispatch({type: ActionType.PUT_ANSWER, data: {answer}});
            http.put(`/quiz/${qzId}/question/${qtId}`, {answer}).then(question => {
                dispatch({type: ActionType.PUT_ANSWER_SUCC, data: question});
                cb();
            })
        }
    }

    // static changeAnswer(answer: string): Action {
    //     return {type: ActionType.CHANGE_ANSWER, data: answer}
    // }

    static setQuizData(data: Object): Action {
        return {type: ActionType.SET_QUIZ_DATA, data}
    }

    static setResultData(data): Action {
        return {type: ActionType.SET_RESULT_DATA, data}
    }

    static putQuiz(id: number, quiz, cb: () => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.PUT_QUIZ, data: quiz});
            http.put(`/quiz/${id}`, quiz).then(quiz => {
                dispatch({type: ActionType.PUT_QUIZ_SUCC, data: quiz});
                cb()
            })
        })
    }

    static postDebugInfo(): Thunk {
        return ((dispatch, getState) => {
            let state = getState();
            dispatch({type: ActionType.POST_DEBUG_INFO, data: state});
            http.post(`/debug?userId=${state.user.id}`, state).then(() => {
                dispatch({type: ActionType.POST_DEBUG_INFO_SUCC, data: null})
            })
        })
    }

    static newStudyQuiz(cb: (quiz) => any): Thunk {
        return ((dispatch, getState) => {
            let state = getState();
            let userId = state.user.id;
            let start = state.user.study.studyIdx + 1;
            let end = state.user.study.studyIdx + 3;
            let quiz = null;
            let mode = "study";
            dispatch({type: ActionType.NEW_QUIZ, data: null});
            http.post(`/quiz?start=${start}&end=${end}`, {userId, mode}).then(res => {
                quiz = res as Quiz;
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                dispatch(ActionCreator.putStudy({quizId: quiz.id}, () => {
                    cb(quiz)
                }));
                //     dispatch({type: ActionType.PUT_STUDY, data: {quizId: quiz.id}});
                //     return http.put(`/study/${studyId}`, {quizId: quiz.id});
                // }).then(res => {
                //     let study = _.defaults({quiz: quiz}, res);
                //     dispatch({type: ActionType.PUT_STUDY_SUCC, data: study});
                //     cb(quiz)
            })
        })
    }

    static putStudy(study: Object, cb: () => void): Thunk {
        return ((dispatch, getState) => {
            let studyId = getState().user.study.id;
            dispatch({type: ActionType.PUT_STUDY, data: study});
            http.put(`/study/${studyId}`, study).then(res => {
                dispatch({type: ActionType.PUT_STUDY_SUCC, data: res});
                cb()
            })
        })
    }

    static setGlobalData(global: Object): Action {
        return {type: ActionType.SET_GLOBAL_DATA, data: global}
    }
}

module.exports = ActionCreator;
export  = ActionCreator;