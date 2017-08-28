import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class ChapterData {
    chapters: { name: String, no: String }[] = [];
}

class ChapterClass {
    data = new ChapterData();

    //noinspection JSUnusedGlobalSymbols
    bindChoose(e) {
        let no = e.target.dataset.no;
        if (no == 0) {
            store.dispatch(ActionCreator.newMarkedQuiz(() => {
                wxx.redirectTo(`./study-answer`)
            }))
        } else {
            store.dispatch(ActionCreator.newStudyQuiz(no, () => {
                wxx.redirectTo(`./study-answer`)
            }))
        }
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            let data = new ChapterData();
            data.chapters = Array(40).join(" ").split(" ").map((v, i) => {
                return {name: `第${i + 1}章`, no: (i + 1).toString()};
            });
            if (state.user.marks.length > 0) {
                data.chapters.unshift({name: "收藏题目", no: "0"});
            }
            return data;
        })
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {

    }
}

Page(new ChapterClass());

