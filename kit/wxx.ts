import WxUser = require("../common/entity/wx-user");
import debug = require("../libs/wx-redux/debug");
/**
 * Created by Administrator on 2017/7/27.
 */

class wxx {
    static getUserInfo(): Promise<WxUser> {
        return new Promise(function (resolve, reject) {
            wx.getUserInfo({
                success: res => resolve(res.userInfo),
                error: err => reject(err),
            })
        })
    }

    static navigateTo(url) {
        debug("Navigate:", url);
        wx.navigateTo({url})
    }

    static redirectTo(url) {
        debug("Redirect:", url);
        wx.redirectTo({url})
    }
}

module.exports = wxx;
export = wxx
