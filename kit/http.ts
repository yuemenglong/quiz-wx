import wxx = require("./wxx");
import debug = require("./debug");

/**
 * Created by Administrator on 2017/7/27
 */

// const HOST = "http://localhost:8888";
const HOST = "https://rdpac.yuemenglong.com";

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

    //noinspection ReservedWordAsName
    static delete<T>(path: string): Promise<T> {
        return http.request("DELETE", path, null)
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
                        wxx.toastError("请求失败");
                        reject(res)
                    } else {
                        debug(`Succ [${method}] ${url}`, res);
                        resolve(res.data)
                    }
                },
                fail: (err) => {
                    debug(`Fail [${method}] ${url}`, err);
                    wxx.toastError("请求失败");
                    reject(err)
                },
            });
        })
    }
}

module.exports = http;
export = http
