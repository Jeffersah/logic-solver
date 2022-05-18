export default class Tree<T> {
    private root: Node<T>;
    public count: number;

    constructor(fromArray: T[])
    constructor(node: Node<T>, count: number)
    constructor(fromArray: T[]|Node<T>, count?: number) {
        if(count === undefined) {
            const arr = fromArray as T[];
            let nodes: ({rightIndex: number, value: Node<T>})[] = arr.map((x, i) => ({rightIndex: i, value: new Leaf<T>(x)}));
            while(nodes.length > 1) {
                let reduced = [];
                for(let i = 0; i < nodes.length; i += 2) {
                    if(i + 1 < nodes.length) {
                        const left = nodes[i];
                        const right = nodes[i+1];
                        const newValue = new Branch(left.rightIndex, left.value, right.value);
                        reduced.push({rightIndex: right.rightIndex, value: newValue});
                    }
                    else {
                        reduced.push(nodes[i]);
                    }
                }
                nodes = reduced;
            }
            this.root = nodes[0].value;
            this.count = arr.length;
        }
        else {
            this.root = fromArray as Node<T>;
            this.count = count;
        }
    }

    set(index: number, value: T): Tree<T> {
        return new Tree<T>(this.root.set(index, value), this.count);
    }

    get(index: number): T {
        if(index < 0 || index >= this.count){
            throw new Error("Index out of bounds");
        }
        return this.root.get(index);
    }

    iterate(): T[]{
        return this.root.iterate();
    }
}


type Node<T> = Leaf<T> | Branch<T>

class Leaf<T> {
    constructor(public value: T){}

    set(index: number, value: T): Node<T> {
        if(value === this.value) return this;
        return new Leaf(value);
    }

    get(index: number): T {
        return this.value;
    }
    
    iterate(): T[] {
        return [this.value];
    }
}

class Branch<T> {
    constructor(public index: number, public left: Node<T>, public right: Node<T>){

    }

    set(index: number, value: T): Node<T> {
        if (index <= this.index) {
            return new Branch(this.index, this.left.set(index, value), this.right);
        } else {
            return new Branch(this.index, this.left, this.right.set(index, value));
        }
    }

    get(index: number): T {
        if(index <= this.index) {
            return this.left.get(index);
        }
        else {
            return this.right.get(index);
        }
    }

    iterate():T[] {
        return [...this.left.iterate(), ...this.right.iterate()];
    }
}