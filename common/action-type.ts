/**
 * Created b    static SET_QUIZ_DATA: any;
 y Administrator on 2017/7/27.
 */

class ActionType {
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
    static PUT_QUIZ_QUESTION: any = "PUT_QUIZ_QUESTION";
    static PUT_QUIZ_QUESTION_SUCC: any = "PUT_QUIZ_QUESTION_SUCC";
    static MERGE_ANSWER: any = "MERGE_ANSWER";
    static CHANGE_ANSWER: any = "CHANGE_ANSWER";
    static PUT_QUIZ: any = "PUT_QUIZ";
    static PUT_QUIZ_SUCC: any = "PUT_QUIZ_SUCC";
    static POST_DEBUG_INFO: any = "POST_DEBUG_INFO";
    static POST_DEBUG_INFO_SUCC: any = "POST_DEBUG_INFO_SUCC";
    static POST_MARK: any = "POST_MARK";
    static POST_MARK_SUCC: any = "POST_MARK_SUCC";
    static DELETE_MARK: any = "DELETE_MARK";
    static DELETE_MARK_SUCC: any = "DELETE_MARK_SUCC";
    static DELETE_QUIZ_QUESTION: any = "DELETE_QUIZ_QUESTION";
    static DELETE_QUIZ_QUESTION_SUCC: any = "DELETE_QUIZ_QUESTION_SUCC";
    static DELETE_QUIZ: any = "DELETE_QUIZ";
    static DELETE_QUIZ_SUCC: any = "DELETE_QUIZ_SUCC";

    static SET_QUIZ_DATA: any = "SET_QUIZ_DATA";
    static CLEAR_UNCORRECT_ANSWER: any = "CLEAR_UNCORRECT_ANSWER";
    static CLEAR_UNCORRECT_ANSWER_SUCC: any = "CLEAR_UNCORRECT_ANSWER_SUCC";
}

module.exports = ActionType;
export = ActionType
