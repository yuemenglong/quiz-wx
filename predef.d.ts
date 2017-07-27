declare let require: (path: string) => any;
declare class module {
    static exports: any
}

declare let App: (opt: Object) => void;
declare let Page: (opt: Object) => void;

declare class wx {
    static getUserInfo(opt: Object)
}