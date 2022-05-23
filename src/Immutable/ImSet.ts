import BTree from "./Tree/BTree";

export default class ImSet<T> {
    private tree: BTree<T>;
    count: number;

    constructor(comparer: (a: T, b: T) => number);
    constructor(tree: BTree<T>);
    constructor(src: BTree<T> | ((a: T, b: T) => number)) {
        if(src instanceof BTree) {
            this.tree = src;
        }
        else {
            this.tree = BTree.empty<T>(src);
        }
        this.count = this.tree.count;
    }

    public add(value: T) {
        return new ImSet(this.tree.add(value));
    }

    public remove(value: T) {
        return new ImSet(this.tree.remove(value));
    }

    public has(value: T): boolean {
        return this.tree.has(value);
    }

    public toArray(): T[] {
        return this.tree.toArray();
    }
}