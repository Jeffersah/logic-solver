export function range(from: number, count: number) {
    let arr = new Array(count);
    for(let i = 0; i < arr.length; i++) arr[i] = from + i;
    return arr;
}