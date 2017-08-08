import wxx = require("./wxx");
import debug = require("./debug");
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
        debug(`Begin [${method}] ${url}`, data);
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url,
                method: method,
                data: data || "",
                header: {"Content-Type": "application/json"},
                success: (res) => {
                    if (res.statusCode >= 400) {
                        debug(`Fail [${method}] ${url}`, res);
                        wxx.showToast("请求失败");
                        reject(res)
                    } else {
                        debug(`Succ [${method}] ${url}`, res);
                        resolve(res.data)
                    }
                },
                fail: (err) => {
                    debug(`Fail [${method}] ${url}`, err);
                    wxx.showToast("请求失败");
                    reject(err)
                },
            });
        })
    }
}

module.exports = http;
export = http
