import store = require("../../reducer/store");
import ActionCreator = require("../../reducer/action-creator");
import wxx = require("../../kit/wxx");
import User = require("../../common/entity/user");
import State = require("../../common/state/state");

//noinspection JSUnusedGlobalSymbols
/**
 * Created by <yuemenglong@126.com> on 2017/7/27
 */

class RegistData {
    code: string;
    user: User;
}

class RegistClass {
    data: RegistData;

    // noinspection JSUnusedGlobalSymbols
    setState(state) {
        let that = this as any;
        that.setData(state)
    }


    // noinspection JSUnusedGlobalSymbols
    bindSubmit() {
        store.dispatch(ActionCreator.registUser(this.data.code, this.data.user.wxUserInfo, (user) => {
            this.setState({code: ""});
            if (user == null) {
                wxx.toastError("注册失败，请填写正确的验证码")
            } else {
                wxx.toastSucc("注册成功");
                wxx.redirectTo("/pages/index/index")
            }
        }))
    }

    // noinspection JSUnusedGlobalSymbols
    bindInput(e: any) {
        this.setState({code: e.detail.value})
    }

    onShow() {
        store.connect(this, (state) => {
            let data = new RegistData();
            data.user = state.user;
            data.code = this.data.code;
            return data;
        });
    }
}

Page(new RegistClass());