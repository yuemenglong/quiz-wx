/**
 * Created by Administrator on 2017/7/27.
 */

const HOST = "http://localhost:8888"

class http {
    static get<T>(path: string): Promise<T> {
        return http.request("GET", path, null)
    }

    static post<T>(path: string, data: Object): Promise<T> {
        return http.request("POST", path, data)
    }

    static request<T>(method: string, path: string, data: Object): Promise<T> {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: HOST + path,
                method: method,
                data: data || "",
                header: {"Content-Type": "application/json"},
                success: (res)=>resolve(res.data),
                error: reject,
            });
        })
    }
}

module.exports = http;
export = http
