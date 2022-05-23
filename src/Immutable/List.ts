export default class List<T> {
    public count: number;
    private head: ListNode<T> | undefined;

    static empty<T>(): List<T>{
        return new List<T>( undefined, 0 );
    }

    static from<T>(values: T[]): List<T> {
        let head = undefined;
        let tail = undefined;
        for(const value of values){
            if(head === undefined){
                head = new ListNode<T>(value, undefined);
                tail = head;
            } else {
                (tail as any).next = new ListNode<T>(value, undefined);
                tail = (tail as any).next;
            }
        }
        return new List<T>(head, values.length);
    }

    private constructor(head: ListNode<T> | undefined, ct: number){
        this.head = head;
        this.count = ct;
    }

    public add(value: T) {
        return new List<T>(new ListNode<T>(value, this.head), this.count + 1);
    }

    public pop(): [T, List<T>] {
        if(this.count === 0 || this.head === undefined){
            throw new Error("Cannot pop from empty list");
        }
        const head = this.head;
        return [head.value, new List<T>(head.next, this.count - 1)];
    }

    public toArray(): T[] {
        let result = new Array(this.count);
        let node = this.head;
        for(let i = 0; i < this.count; i++){
            result[i] = node!.value;
            node = node!.next;
        }
        return result;
    }
}

class ListNode<T> {
    constructor(public value: T, public next: ListNode<T> | undefined) {

    }
}