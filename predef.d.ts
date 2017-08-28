declare let require: (path: string) => any;

declare class module {
    static exports: any
}

declare class Promise<T> {
    constructor(fn: Function)
}

declare let App: (opt: Object) => void;
declare let Page: (opt: Object) => void;
declare let getApp: () => any;

declare class wx {
    static getUserInfo(opt: Object)

    static navigateTo(opt: Object)

    static redirectTo(opt: Object)

    static request(opt: Object)

    static showModal(opt: Object)

    static showToast(opt: Object)

    static showModal(opt: Object)

    static getStorageSync(name: string): string

    static setStorageSync(name: string, value: string)
}