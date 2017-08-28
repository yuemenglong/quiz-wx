import {Thunk, Dispatch, GetState} from "../common/interface";
import ActionType = require("../common/action-type");
import kit = require("../kit/wxx");
import http = require("../kit/http");
import User = require("../common/entity/user");
import Quiz = require("../common/entity/quiz");
import _ = require("../libs/lodash/index");
import Question = require("../common/entity/question");
import QuizQuestion = require("../common/entity/quiz-question");
import WxUserInfo = require("../common/entity/wx-user-info");

/**
 * Created by Administrator on 2017/7/27
 */

class ActionCreator {
    static getWxUserInfo(cb: (wxUserInfo: WxUserInfo) => void): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.FETCH_WX_USER, data: null});
            kit.getUserInfo().then(wxUserInfo => {
                dispatch({type: ActionType.FETCH_WX_USER_SUCC, data: wxUserInfo});
                cb(wxUserInfo)
            })
        })
    }

    static registUser(wxUserInfo: WxUserInfo, cb: () => void): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.REGIST_USER, data: null});
            http.post(`/user`, {wxUserInfo: wxUserInfo}).then(res => {
                dispatch({type: ActionType.REGIST_USER_SUCC, data: res});
                cb()
            })
        })
    }

    static fetchUser(code: string, cb: () => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            if (getState().user != null) {
                return getState().user;
            }
            dispatch({type: ActionType.FETCH_USER, data: null});
            return http.get<User>(`/user?code=${code}`).then(user => {
                dispatch({type: ActionType.FETCH_USER_SUCC, data: user});
                return user;
            })
        }
    }

    static newQuiz(cb: (quiz: Quiz) => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: {mode: "quiz"}});
            let userId = getState().user.id;
            let mode = "answer";
            http.post(`/quiz`, {tag: "quiz", userId, mode}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz);
            })
        }
    }

    static newStudyQuiz(chapter: number, cb: (quiz: Quiz) => void): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: {chapter}});
            let userId = getState().user.id;
            let mode = "study";
            let tag = "study";
            http.post(`/quiz?chapter=${chapter}`, {tag, userId, mode}).then(quiz => {
                let quizId = _.get(quiz, "id");
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                dispatch(ActionCreator.putStudy({quizId: quizId}, () => {
                    cb(quiz as Quiz)
                }))
            })
        })
    }

    static newExamQuiz(cb: (quiz: Quiz) => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: "exam"});
            let userId = getState().user.id;
            let mode = "answer";
            http.post(`/quiz?single=120&multi=30`, {tag: "exam", userId, mode}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz);
            })
        }
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

    //noinspection JSUnusedGlobalSymbols
    static deleteQuizQuestion(quizId: number, qtId: number, cb: () => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.DELETE_QUIZ_QUESTION, data: {quizId, qtId}});
            http.delete(`/quiz-question/${qtId}`).then(() => {
                dispatch({type: ActionType.DELETE_QUIZ_QUESTION_SUCC, data: {quizId, qtId}});
                cb();
            })
        })
    }

    static putAnswer(qzId: number, qtId: number, answer: string, cb: (question: QuizQuestion) => void): Thunk {
        return (dispatch: Dispatch) => {
            dispatch({type: ActionType.PUT_QUIZ_QUESTION, data: {answer}});
            http.put(`/quiz/${qzId}/question/${qtId}`, {answer}).then(question => {
                dispatch({type: ActionType.PUT_QUIZ_QUESTION_SUCC, data: question});
                cb(question as QuizQuestion);
            })
        }
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

    static postMark(infoId: number, cb: () => void): Thunk {
        return ((dispatch, getState) => {
            let state = getState();
            let userId = state.user.id;
            dispatch({type: ActionType.POST_MARK, data: infoId});
            http.post(`/user/${userId}/mark`, {infoId}).then(res => {
                dispatch({type: ActionType.POST_MARK_SUCC, data: res});
                cb()
            })
        })
    }

    static deleteMark(markId: number, cb: () => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.DELETE_MARK, data: markId});
            http.delete(`/mark/${markId}`).then(() => {
                dispatch({type: ActionType.DELETE_MARK_SUCC, data: markId});
                cb()
            })
        })
    }

    static deleteQuiz(quizId: number, cb: () => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.DELETE_QUIZ, data: quizId});
            http.delete(`/quiz/${quizId}`).then(() => {
                dispatch({type: ActionType.DELETE_QUIZ_SUCC, data: quizId});
                cb();
            })
        })
    }

    static newMarkedQuiz(cb: () => any): Thunk {
        return ((dispatch, getState) => {
            let state = getState();
            let data = {userId: state.user.id, mode: "study", tag: "study"};
            dispatch({type: ActionType.NEW_QUIZ, data: "marked"});
            http.post(`/quiz?marked=true`, data).then(res => {
                let quiz = res as Quiz;
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: res});
                dispatch(ActionCreator.putStudy({quizId: quiz.id}, () => {
                    cb();
                }))
            })
        })
    }
}

module.exports = ActionCreator;
export = ActionCreator;