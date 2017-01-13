export const wrap = (ctx, fn, ...args) => {

    return new Promise((resolve, reject) => {
        fn.call(ctx, ...args, (error, data) => {
            if (error) {
                reject(error.stack);
            } else {
                resolve(data);
            }
        });
    });
};

export const pad = (num, n) => {
    let len = num.toString().length;
    while(len < n) {
        num = '0' + num;
        len++;
    }
    return num;
}

export const formatTime = (date) => {

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const tDate = pad(date.getDate(), 2);
    const hours = pad(date.getHours(), 2);
    const minutes = pad(date.getMinutes(), 2);
    const seconds = pad(date.getSeconds(), 2);
    const milliSeconds = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${tDate} ${hours}:${minutes}:${seconds}.${milliSeconds}`;
};
