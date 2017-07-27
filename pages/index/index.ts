import ActionType = require("../../common/action-type");
import App = require("../../common/app");
/**
 * Created by <yuemenglong@126.com> on 2017/7/27.
 */

const app = getApp() as App;

Page({
    data:{},
    onLoad: function () {
        console.log("Page OnLoad");
        app.dispatch(ActionType.TEST, "hi");
    }
});

