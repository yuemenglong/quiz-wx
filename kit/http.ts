/**
 * Created by Administrator on 2017/7/27.
 */

class http {
    static get(url: string, cb: (data: any) => void) {
        http.request("GET", url, null, cb)
    }

    static post(url: string, data: Object, cb: (data: any) => void) {
        http.request("POST", url, data, cb)
    }

    static request(method: string, url: string, data: Object, cb: (data: any) => void) {
        wx.request({
            url: url,
            method: method,
            data: data || "",
            header: {"Content-Type": "application/json"},
            success: (res) => cb && cb(res)
        });
    }
}
