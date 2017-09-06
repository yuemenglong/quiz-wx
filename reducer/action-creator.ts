import {Thunk, Dispatch, GetState} from "../common/interface";
import ActionType = require("../common/action-type");
import http = require("../kit/http");
import User = require("../common/entity/user");
import Quiz = require("../common/entity/quiz");
import Question = require("../common/entity/question");
import QuizQuestion = require("../common/entity/quiz-question");
import WxUserInfo = require("../common/entity/wx-user-info");
import Chapter = require("../common/entity/chapter");

/**
 * Created by Administrator on 2017/7/27
 */

class ActionCreator {
    static registUser(code: string, wxUserInfo: WxUserInfo, cb: (user: User) => void): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.REGIST_USER, data: {code, wxUserInfo}});
            http.post(`/user`, {code, wxUserInfo, marks: []}).then(user => {
                dispatch({type: ActionType.REGIST_USER_SUCC, data: user});
                cb(user as User)
            })
        })
    }

    static fetchUser(code: string, cb: (user: User) => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.FETCH_USER, data: null});
            return http.get<User>(`/user?code=${code}`).then(user => {
                dispatch({type: ActionType.FETCH_USER_SUCC, data: user});
                cb(user)
            })
        }
    }

    static newQuiz(cb: (quiz: Quiz) => void): Thunk {
        return (dispatch: Dispatch, getState: GetState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: {mode: "quiz"}});
            let userId = getState().user.id;
            let mode = "answer";
            http.post(`/quiz?userId=${userId}&single=2&multi=1`, {tag: "quiz", userId, mode}).then(quiz => {
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
            http.post(`/quiz?chapter=${chapter}&userId=${userId}`, {tag, userId, mode}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
                cb(quiz as Quiz)
            })
        })
    }


    static newMarkedQuiz(cb: (quiz: Quiz) => any) {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.NEW_QUIZ, data: "marked"});
            let userId = getState().user.id;
            let mode = "study";
            let tag = "marked";
            http.post(`/quiz?marked=true&userId=${userId}`, {tag, userId, mode}).then(quiz => {
                dispatch({type: ActionType.NEW_QUIZ_SUCC, data: quiz});
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

    static clearUncorrectAnswer(quiz: Quiz, cb: () => void): Thunk {
        let updater = {answer: ""};
        return ((dispatch) => {
            dispatch({type: ActionType.CLEAR_UNCORRECT_ANSWER, data: quiz});
            http.put(`/quiz-question?quizId=${quiz.id}&correct=false`, updater).then(updater => {
                dispatch({type: ActionType.CLEAR_UNCORRECT_ANSWER_SUCC, data: quiz});
                cb()
            })
        })
    }

    // static putStudy(study: Object, cb: () => void): Thunk {
    //     return ((dispatch, getState) => {
    //         let studyId = getState().user.study.id;
    //         dispatch({type: ActionType.PUT_STUDY, data: study});
    //         http.put(`/study/${studyId}`, study).then(res => {
    //             dispatch({type: ActionType.PUT_STUDY_SUCC, data: res});
    //             cb()
    //         })
    //     })
    // }

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

    static deleteQuiz(quiz: Quiz, cb: () => void): Thunk {
        return ((dispatch) => {
            dispatch({type: ActionType.DELETE_QUIZ, data: quiz});
            http.delete(`/quiz/${quiz.id}?tag=${quiz.tag}`).then(() => {
                dispatch({type: ActionType.DELETE_QUIZ_SUCC, data: quiz});
                cb();
            })
        })
    }

    // static newMarkedQuiz(cb: () => any): Thunk {
    //     return ((dispatch, getState) => {
    //         let state = getState();
    //         let data = {userId: state.user.id, mode: "study", tag: "study"};
    //         dispatch({type: ActionType.NEW_QUIZ, data: "marked"});
    //         http.post(`/quiz?marked=true`, data).then(res => {
    //             let quiz = res as Quiz;
    //             dispatch({type: ActionType.NEW_QUIZ_SUCC, data: res});
    //             dispatch(ActionCreator.putStudy({quizId: quiz.id}, () => {
    //                 cb();
    //             }))
    //         })
    //     })
    // }

    static setQuizData(data: any) {
        return {type: ActionType.SET_QUIZ_DATA, data}
    }

    static setWxUserInfo(wxUserInfo: WxUserInfo) {
        return {type: ActionType.SET_WX_USER_INFO, data: wxUserInfo}
    }

    static fetchChapter(cb: () => any): Thunk {
        return ((dispatch, getState) => {
            dispatch({type: ActionType.FETCH_CHAPTER, data: null});
            http.get("/chapters").then((chapters: Chapter[]) => {
                dispatch({type: ActionType.FETCH_CHAPTER_SUCC, data: chapters});
                cb()
            })
        })
    }
}

module.exports = ActionCreator;
export = ActionCreator;