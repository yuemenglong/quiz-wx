import WxUser = require("../common/entity/wx-user");
/**
 * Created by Administrator on 2017/7/27.
 */

class kit {
    static getUserInfo(): Promise<WxUser> {
        return new Promise(function (resolve, reject) {
            wx.getUserInfo({
                success: res => resolve(res.userInfo),
                error: err => reject(err),
            })
        })
    }

    static navigateTo(url) {
        wx.navigateTo({url})
    }
}

module.exports = kit;
export = kit
