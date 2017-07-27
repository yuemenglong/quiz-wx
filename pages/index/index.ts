import ActionType = require("../../common/action-type");
import App = require("../../common/App");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

const app = getApp() as App;

Page({
    onLoad: function () {
        console.log("Page OnLoad")
        getApp().dispatch(ActionType.TEST, "hi")
    }
});

