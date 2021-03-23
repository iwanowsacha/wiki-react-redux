export default function delay(fn: any, ms: number) {
    let timer: any = 0;
    return function (...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
};