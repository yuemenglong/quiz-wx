/**
 * Created by Administrator on 2017/7/27.
 */

class ActionType {
    static INIT = "INIT";
    static FETCH_WX_USER: any = "FETCH_WX_USER";
    static FETCH_WX_USER_SUCC: any = "FETCH_WX_USER_SUCC";
    static FETCH_USER: any = "FETCH_USER";
    static FETCH_USER_SUCC: any = "FETCH_USER_SUCC";
    static REGIST_USER: any = "REGIST_USER";
    static REGIST_USER_SUCC: any = "REGIST_USER_SUCC";
    static NEW_QUIZ: any = "NEW_QUIZ";
    static NEW_QUIZ_SUCC: any = "NEW_QUIZ_SUCC";
    static FETCH_QUESTION: any = "FETCH_QUESTION";
    static FETCH_QUESTION_SUCC: any = "FETCH_QUESTION_SUCC";
    static PUT_ANSWER: any = "PUT_ANSWER";
    static PUT_ANSWER_SUCC: any = "PUT_ANSWER_SUCC";
    static FETCH_QUIZ: any = "FETCH_QUIZ";
    static FETCH_QUIZ_SUCC: any = "FETCH_QUIZ_SUCC";
    static MERGE_ANSWER: any = "MERGE_ANSWER";
    static CHANGE_ANSWER: any = "CHANGE_ANSWER";
    static SET_QUIZ_DATA: any = "SET_QUIZ_DATA";
    static SET_RESULT_DATA: any = "SET_RESULT_DATA";
    static PUT_QUIZ: any = "PUT_QUIZ";
    static PUT_QUIZ_SUCC: any = "PUT_QUIZ_SUCC";
    static POST_DEBUG_INFO: any = "POST_DEBUG_INFO";
    static POST_DEBUG_INFO_SUCC: any = "POST_DEBUG_INFO_SUCC";
    static PUT_STUDY: any = "PUT_STUDY";
    static PUT_STUDY_SUCC: any = "PUT_STUDY_SUCC";
}

module.exports = ActionType;
export = ActionType
