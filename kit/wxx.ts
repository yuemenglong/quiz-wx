import WxUser = require("../common/entity/wx-user");
import debug = require("./debug");
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

    static navigateTo(url: string) {
        debug("[Navigate] => ", url);
        wx.navigateTo({url})
    }

    static redirectTo(url) {
        debug("[Redirect] => ", url);
        wx.redirectTo({url})
    }

    static showToast(title: string, duration: number = 1500) {
        wx.showToast({title, duration})
    }

    static loadingToast(title: string, duration: number = 1500) {
        let icon = "loading";
        wx.showToast({title, duration, icon})
    }

    static showModal(title: string, content: string): Promise<boolean> {
        return new Promise<boolean>(function (resolve, reject) {
            wx.showModal({
                title, content, success: (res) => {
                    if (res.confirm) return resolve(true);
                    else if (res.cancel) return resolve(false);
                    else return reject(Error("Unreachable"))
                }
            })
        })
    }
}

module.exports = wxx;
export = wxx
