import { ITreeNode, AddOrSetResult, RemoveResult } from "./BTree";

export class TreeLeaf<T> implements ITreeNode<T> {
    constructor(public maxKeyCount: number, public values: T[], public comparer: (a: T, b: T) => number) {
    }

    private keyIndex(value: T) {
        for (let i = 0; i < this.values.length; i++) {
            const cmp = this.comparer(value, this.values[i]);
            if (cmp === 0)
                return i;
            if (cmp < 0)
                return ~i;
        }
        return ~this.values.length;
    }

    private split(valueIndex: number, newValue: T) {
        let allValues = this.values.slice();
        allValues.splice(valueIndex, 0, newValue);

        let midIndex = Math.floor(allValues.length / 2);

        let midValue = allValues[midIndex];
        let leftValues = allValues.slice(0, midIndex);
        let rightValues = allValues.slice(midIndex + 1);

        return {
            value: midValue,
            left: new TreeLeaf<T>(this.maxKeyCount, leftValues, this.comparer),
            right: new TreeLeaf<T>(this.maxKeyCount, rightValues, this.comparer)
        };
    }

    add(value: T): AddOrSetResult<T> {
        let idx = this.keyIndex(value);
        if (idx >= 0)
            return { result: 'nochange' }; // Duplicate value
        idx = ~idx;
        if (this.values.length < this.maxKeyCount) {
            // We can add it without splitting
            let newValues = [...this.values];
            newValues.splice(idx, 0, value);
            return { result: 'added', tree: new TreeLeaf(this.maxKeyCount, newValues, this.comparer) };
        }
        else {
            // We need to split
            return { result: 'split', ...this.split(idx, value) };
        }
    }
    set(value: T): AddOrSetResult<T> {
        let idx = this.keyIndex(value);
        if (idx >= 0){
            const values = this.values.slice();
            values.splice(idx, 1, value);
            return { result: 'changed', tree: new TreeLeaf(this.maxKeyCount, values, this.comparer)};
        }
        idx = ~idx;
        if (this.values.length < this.maxKeyCount) {
            // We can add it without splitting
            let newValues = [...this.values];
            newValues.splice(idx, 0, value);
            return { result: 'added', tree: new TreeLeaf(this.maxKeyCount, newValues, this.comparer) };
        }
        else {
            // We need to split
            return { result: 'split', ...this.split(idx, value) };
        }
    }

    has(value: T): boolean {
        return this.keyIndex(value) >= 0;
    }
    get(value: T): T|undefined {
        let idx = this.keyIndex(value);
        if(idx >= 0) return this.values[idx];
        return undefined;
    }
    max(): T {
        return this.values[this.values.length - 1];
    }
    min(): T {
        return this.values[0];
    }

    tryRotateMin(): { value: T; leftOrphan?: ITreeNode<T> | undefined; tree: ITreeNode<T> } | undefined {
        if(this.values.length <= this.maxKeyCount / 2) return undefined;
        return {
            value: this.values[0],
            leftOrphan: undefined,
            tree: new TreeLeaf(this.maxKeyCount, this.values.slice(1), this.comparer)
        }
    }

    tryRotateMax(): { value: T; rightOrphan?: ITreeNode<T> | undefined; tree: ITreeNode<T> } | undefined {
        if(this.values.length <= this.maxKeyCount / 2) return undefined;
        return {
            value: this.values[this.values.length-1],
            rightOrphan: undefined,
            tree: new TreeLeaf(this.maxKeyCount, this.values.slice(0, this.values.length-1), this.comparer)
        }
    }

    remove(value: T): RemoveResult<T> {
        const idx = this.keyIndex(value);
        if(idx < 0) return {result: 'nochange'};
        const newValues = [...this.values];
        newValues.splice(idx, 1);
        return {
            result: 'removed',
            tree: new TreeLeaf(this.maxKeyCount, newValues, this.comparer),
            value: value,
            needMerge: newValues.length < this.maxKeyCount / 2
        }
    }
    removeMax(): { result: 'removed', tree: ITreeNode<T>, value: T, needMerge: boolean } {
        const newValues = this.values.slice(0, this.values.length-1);
        return {
            result: 'removed',
            tree: new TreeLeaf(this.maxKeyCount, newValues, this.comparer),
            value: this.values[this.values.length-1],
            needMerge: newValues.length < this.maxKeyCount / 2
        }
    }

    prepend(value: T, orphan?: ITreeNode<T>) {
        this.values.splice(0, 0, value);
    }
    append(value: T, orphan?: ITreeNode<T>) {
        this.values.push(value);
    }
    merge(divider: T, other: ITreeNode<T>){
        let leaf = other as any as TreeLeaf<T>; // Merge will ALWAYS be called against a leaf, since it'll always be sibling->sibling merges
        
        return new TreeLeaf<T>(this.maxKeyCount, [...this.values, divider, ...leaf.values], this.comparer);
    }
    tryGetSingleChild(): ITreeNode<T> | undefined {
        return undefined;
    }

    toArray(): T[] {
        return this.values;
    }
}
