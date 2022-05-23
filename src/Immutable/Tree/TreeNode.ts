import { ITreeNode, AddOrSetResult, RemoveResult } from "./BTree";

export class TreeNode<T> implements ITreeNode<T>{
    constructor(public maxKeyCount: number, public values: T[], public children: ITreeNode<T>[], public comparer: (a: T, b: T) => number) {
    
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

    private newTree(values: T[], children: ITreeNode<T>[]): TreeNode<T> {
        return new TreeNode<T>(this.maxKeyCount, values, children, this.comparer);
    }

    private split(valueIndex: number, newValue: T, newLeft: ITreeNode<T>, newRight: ITreeNode<T>) {
        let allValues = this.values.slice();
        allValues.splice(valueIndex, 0, newValue);
        let allChildren = this.children.slice();
        allChildren.splice(valueIndex, 1, newLeft, newRight);

        let midIndex = Math.floor(allValues.length / 2);

        let midValue = allValues[midIndex];
        let leftValues = allValues.slice(0, midIndex);
        let rightValues = allValues.slice(midIndex + 1);
        let leftChildren = allChildren?.slice(0, midIndex + 1);
        let rightChildrne = allChildren?.slice(midIndex + 1);

        return { value: midValue, left: this.newTree(leftValues, leftChildren), right: this.newTree(rightValues, rightChildrne) };
    }

    add(value: T): AddOrSetResult<T> {
        let idx = this.keyIndex(value);
        if (idx >= 0)
            return { result: 'nochange' }; // Duplicate value
        idx = ~idx;
        let innerResult = this.children[idx].add(value);
        return this.handleSetAddResult(idx, innerResult);
    }
    set(value: T): AddOrSetResult<T> {
        let idx = this.keyIndex(value);
        if (idx >= 0) {
            const newValues = this.values.slice();
            newValues.splice(idx, 1, value);
            return { result: 'changed', tree: this.newTree(newValues, this.children) };
        }
        idx = ~idx;
        let innerResult = this.children[idx].set(value);
        return this.handleSetAddResult(idx, innerResult);
    }

    private handleSetAddResult(idx: number, innerResult: AddOrSetResult<T>): AddOrSetResult<T>{
        switch (innerResult.result) {
            case 'nochange': return innerResult;
            case 'added':
            case 'changed':
                const newChildren = this.children.slice();
                newChildren.splice(idx, 1, innerResult.tree);
                return {
                    result: innerResult.result,
                    tree: this.newTree(this.values, newChildren)
                };
            case 'split':
                let { value, left, right } = innerResult;
                if (this.values.length < this.maxKeyCount) {
                    // We can add it without splitting
                    let newValues = [...this.values];
                    newValues.splice(idx, 0, value);
                    let newChildren = [...this.children];
                    newChildren.splice(idx, 1, left, right);
                    return { result: 'added', tree: this.newTree(newValues, newChildren) };
                }
                else {
                    // We need to split
                    return { result: 'split', ...this.split(idx, value, left, right) };
                }
        }
    }

    has(value: T): boolean {
        let idx = this.keyIndex(value);
        if (idx >= 0)
            return true;
        return this.children[~idx].has(value);
    }
    get(value: T): T|undefined {
        let idx = this.keyIndex(value);
        if (idx >= 0)
            return this.values[idx];
        return this.children[~idx].get(value);
    }

    max() {
        return this.children[this.children.length - 1].max();
    }

    min() {
        return this.children[0].min();
    }

    tryRotateMin(): { value: T; leftOrphan?: ITreeNode<T> | undefined; tree: ITreeNode<T>; } | undefined {
        if(this.values.length <= this.maxKeyCount / 2) return undefined;
        return {
            value: this.values[0],
            leftOrphan: this.children[0],
            tree: this.newTree(this.values.slice(1), this.children.slice(1))
        };
    }

    tryRotateMax(): { value: T; rightOrphan?: ITreeNode<T> | undefined; tree: ITreeNode<T>; } | undefined {
        if(this.values.length <= this.maxKeyCount / 2) return undefined;
        return {
            value: this.values[this.values.length - 1],
            rightOrphan: this.children[this.children.length - 1],
            tree: this.newTree(this.values.slice(0, this.values.length - 1), this.children.slice(0, this.children.length - 1))
        };
    }

    private handleChildRemove(index: number, rmValue: T, spliceValue: T | undefined, result: RemoveResult<T>): RemoveResult<T> {
        if(result.result === 'nochange') return result;

        let selfValues = this.values;
        if(spliceValue !== undefined) {
            selfValues = selfValues.slice();
            selfValues.splice(index, 1, spliceValue);
        }
        let selfChildren = this.children.slice();
        selfChildren.splice(index, 1, result.tree);

        if(!result.needMerge) {
            return {
                result: 'removed',
                tree: this.newTree(selfValues, selfChildren),
                value: rmValue,
                needMerge: false
            };
        }
        else {
            let needMerge = this.mergeChildren(selfValues, selfChildren, index);
            return {
                result: 'removed',
                tree: this.newTree(selfValues, selfChildren),
                value: rmValue,
                needMerge
            };
        }
    }

    private mergeChildren(values: T[], children: ITreeNode<T>[], index: number): boolean {
        if(index > 0){
            const rr = children[index - 1].tryRotateMax();
            if(rr !== undefined) {
                children[index].prepend(values[index-1], rr.rightOrphan);
                values[index-1] = rr.value;
                children[index-1] = rr.tree;
                return false; // No merge required
            }
        }
        if(index + 1 < children.length) {
            const rl = children[index + 1].tryRotateMin();
            if(rl !== undefined) {
                children[index].append(values[index], rl.leftOrphan);
                values[index] = rl.value;
                children[index+1] = rl.tree;
                return false; // No merge required
            }
        }
        // Ok, we have to do a full merge
        if(index === 0){
            let minv = values[0];
            let lc = children[0];
            let rc = children[1];
            values.splice(0, 1);
            children.splice(0, 2, lc.merge(minv, rc));
        }
        else {
            let divider = values[index-1];
            let lc = children[index-1];
            let rc = children[index];
            values.splice(index-1, 1);
            children.splice(index-1, 2, lc.merge(divider, rc));
        }
        return values.length < this.maxKeyCount / 2;
    }

    remove(value: T): RemoveResult<T> {
        let idx = this.keyIndex(value);
        if(idx < 0) {
            return this.handleChildRemove(~idx, value, undefined, this.children[~idx].remove(value));
        }
        else {
            let innerResult = this.children[idx].removeMax();
            return this.handleChildRemove(idx, value, innerResult.value, innerResult);
        }
    }

    removeMax(): { result: 'removed', tree: ITreeNode<T>, value: T, needMerge: boolean } {
        let idx = this.values.length;
        let innerResult = this.children[idx].removeMax();
        return this.handleChildRemove(idx, innerResult.value, undefined, innerResult) as any;
    }

    prepend(value: T, orphan?: ITreeNode<T>){
        this.values.splice(0, 0, value);
        if(orphan !== undefined)
            this.children.splice(0, 0, orphan);
    }

    append(value: T, orphan?: ITreeNode<T>){
        this.values.push(value);
        if(orphan !== undefined)
            this.children.push(orphan);
    }

    merge(divider: T, other: ITreeNode<T>){
        let branch = other as any as TreeNode<T>;
        return this.newTree([... this.values, divider, ...branch.values], [...this.children, ...branch.children]);
    }
    tryGetSingleChild(): ITreeNode<T> | undefined {
        if(this.values.length === 0 && this.children.length === 1) return this.children[0];
        return undefined;
    }
    toArray(): T[] {
        let arr = this.children[0].toArray();
        for(let i = 1; i < this.children.length; i++){
            arr.push(this.values[i-1]);
            arr.push(...this.children[i].toArray());
        }
        return arr;
    }
}
