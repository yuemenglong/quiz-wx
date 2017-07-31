import WxUser = require("../common/entity/wx-user");
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
        wx.navigateTo({url})
    }

    static redirectTo(url){
        console.log
        wx.redirectTo({url})
    }
}

module.exports = wxx;
export = wxx
