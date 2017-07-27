import WxUser = require("../common/entity/wx-user");
/**
 * Created by Administrator on 2017/7/27.
 */

class kit {
    static getUserInfo(cb: (WxUser) => void) {
        wx.getUserInfo({
            success: res => cb && cb(res.userInfo)
        })
    }
}

module.exports = kit;
export = kit
