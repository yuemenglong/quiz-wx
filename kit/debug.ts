import wxx = require("./wxx");
/**
 * Created by Administrator on 2017/7/31.
 */

function debug(...args) {
    console.log.apply(console, arguments)
}

module.exports = debug;
export =debug
