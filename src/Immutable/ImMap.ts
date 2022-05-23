import BTree from "./Tree/BTree";

export default class ImMap<TKey, TValue> {
    private tree: BTree<{key: TKey, value: TValue}>;
    count: number;

    constructor(comparer: (a: TKey, b: TKey) => number);
    constructor(tree: BTree<{key: TKey, value: TValue}>);
    constructor(src: BTree<{key: TKey, value: TValue}> | ((a: TKey, b: TKey) => number)) {
        if(src instanceof BTree) {
            this.tree = src;
        }
        else {
            this.tree = BTree.empty<{key: TKey, value: TValue}>((a, b) => src(a.key, b.key));
        }
        this.count = this.tree.count;
    }

    public remove(key: TKey): ImMap<TKey, TValue> {
        return new ImMap<TKey, TValue>(this.tree.remove({ key, value: (undefined as any) }));
    }

    public get(key: TKey): TValue | undefined {
        let result = this.tree.get({ key, value: (undefined as any) });
        if(result === undefined) return undefined;
        return result.value;
    }

    public set(key: TKey, value: TValue): ImMap<TKey, TValue> {
        return new ImMap<TKey, TValue>(this.tree.set({ key, value }));
    }

    public has(key: TKey): boolean {
        return this.tree.has({ key, value: (undefined as any) });
    }

    public toArray(): {key: TKey, value: TValue}[] {
        return this.tree.toArray();
    }
}