/**
 * Created by Administrator on 2017/7/27.
 */

interface Store {
    dispatch(action: any): void
    getState(): any
    subscribe(fn: () => void): void
}

export = Store
