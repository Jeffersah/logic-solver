export default class Point2d {
    static add(a: IPoint2d, b: IPoint2d) {
        return { x: a.x + b.x, y: a.y + b.y }
    }
    static subtract(a: IPoint2d, b: IPoint2d) {
        return { x: a.x - b.x, y: a.y - b.y }
    }
    static multiply(a: IPoint2d, b: IPoint2d | number)
    {
        if(typeof b === 'number') {
            return { x: a.x * b, y: a.y * b };
        }
        else {
            return { x: a.x * b.x, y: a.y * b.y };
        }
    }
}

export interface IPoint2d {
    x: number;
    y: number;
}