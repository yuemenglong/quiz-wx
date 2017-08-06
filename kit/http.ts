import wxx = require("./wxx");
import debug = require("../libs/wx-redux/debug");
/**
 * Created by Administrator on 2017/7/27.
 */

// const HOST = "http://211.159.173.48:8888";
const HOST = "http://localhost:8888";

class http {
    static get<T>(path: string): Promise<T> {
        return http.request("GET", path, null)
    }

    static post<T>(path: string, data: Object): Promise<T> {
        return http.request("POST", path, data)
    }

    static put<T>(path: string, data: Object): Promise<T> {
        return http.request("PUT", path, data)
    }

    static request<T>(method: string, path: string, data: Object): Promise<T> {
        let url = HOST + path;
        debug(`${method} ${url}`, data);
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url,
                method: method,
                data: data || "",
                header: {"Content-Type": "application/json"},
                success: (res) => {
                    debug(`${method} ${url} Succ`, res);
                    resolve(res.data)
                },
                error: (err) => {
                    debug(`${method} ${url} Fail`, err);
                    wxx.showToast("网络请求异常");
                    reject(err)
                },
            });
        })
    }
}

module.exports = http;
export = http
