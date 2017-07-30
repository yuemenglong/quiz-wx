import _ = require("../libs/lodash/index");
/**
 * Created by yml on 2017/7/27.
 */

class kit {

    static update(obj: Object, path: string, pathArgs: any[], value: any): Object {
        function go(obj: Object, paths: string[], pathArgs: any[], value: any): Object {
            if (obj == null) {
                throw Error("Can't Merge Obj If Is Null")
            }
            let name = paths[0];
            let matchArr = name.match(/(.+)\[(.*)]/);
            let matchObj = name.match(/(.+){}/);
            if (matchArr && matchArr[2].length > 0) {
                // 数组替换
                if (pathArgs.length == 0) throw  Error("Path Args Not Match");
                name = matchArr[1];
                let condName = matchArr[2];
                let condValue = pathArgs[0];
                let idx = null;
                if (condName == "$idx") {
                    idx = condValue
                } else {
                    idx = _.findIndex(obj[name], (item) => item[condName] == condValue);
                }
                let oldValue = obj[name][idx];
                let newValue = null;
                if (paths.length > 1) {
                    newValue = go(oldValue, paths.slice(1), pathArgs.slice(1), value);
                } else {
                    newValue = value;
                }
                let newArr = _.clone(obj[name]);
                newArr[idx] = newValue;
                let merge = {};
                merge[name] = newArr;
                return _.defaults(merge, obj);
            } else if (matchArr && matchArr[2].length == 0) {
                // 数组追加
                if (paths.length != 1)throw Error("Append Array Item Must At End Of Path");
                let name = matchArr[1];
                let arr = obj[name].concat([value]);
                let merge = {};
                merge[name] = arr;
                return _.defaults(merge, obj);
            } else if (matchObj) {
                // 对象merge
                let name = matchObj[1];
                let oldValue = obj[name];
                let newValue = null;
                if (paths.length > 1) {
                    throw Error("Merge Must At End")
                } else {
                    newValue = _.defaults({}, value, oldValue);
                }
                let merge = {};
                merge[name] = newValue;
                return _.defaults(merge, obj);
            } else {
                // 对象替换
                let oldValue = obj[name];
                let newValue = null;
                if (paths.length > 1) {
                    newValue = go(oldValue, paths.slice(1), pathArgs, value);
                } else {
                    newValue = value;
                }
                let merge = {};
                merge[name] = newValue;
                return _.defaults(merge, obj);
            }
        }

        return go(obj, path.split("."), pathArgs, value)
    }
}

module.exports = kit;
export = kit;
