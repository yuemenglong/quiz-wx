import State = require("../../common/state/state");
import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");

/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class ChapterData {
    chapters: { name: String, id: number }[] = [];
}

class ChapterClass {
    data = new ChapterData();

    //noinspection JSUnusedGlobalSymbols
    bindChoose(e) {
        let id = e.target.dataset.id;
        store.dispatch(ActionCreator.newStudyQuiz(id, () => {
            wxx.redirectTo(`./study-answer`)
        }))
    }

    //noinspection JSUnusedGlobalSymbols
    onShow() {
        store.connect(this, (state: State) => {
            let data = new ChapterData();
            data.chapters = state.chapters.map((chapter) => {
                return {name: chapter.name, id: chapter.id};
            });
            return data;
        })
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    onLoad() {

    }
}

Page(new ChapterClass());

