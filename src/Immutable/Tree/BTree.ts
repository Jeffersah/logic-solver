import { TreeLeaf } from "./TreeLeaf";
import { TreeNode } from "./TreeNode";

const MAX_TREE_KEY_COUNT = 2;

export default class BTree<T> {

    public static empty<T>(comparer: (a: T, b: T) => number = (a, b) => a < b ? -1 : a > b ? 1 : 0): BTree<T> {
        return new BTree<T>(new TreeLeaf<T>(MAX_TREE_KEY_COUNT, [], comparer), 0)
    }

    private constructor(private root: ITreeNode<T>, public count: number){

    }

    has(value: T): boolean {
        return this.root.has(value);
    }
    get(value: T): T|undefined {
        return this.root.get(value);
    }

    add(value: T) {
        let result = this.root.add(value);
        console.log(result);
        switch(result.result){
            case 'nochange': return this;
            case 'added': return new BTree<T>(result.tree, this.count + 1);
            case 'changed': return new BTree<T>(result.tree, this.count);
            case 'split': return new BTree<T>(new TreeNode<T>(MAX_TREE_KEY_COUNT, [result.value], [ result.left, result.right ], this.root.comparer), this.count + 1);
        }
    }

    set(value: T) {
        let result = this.root.add(value);
        switch(result.result){
            case 'nochange': return this;
            case 'added': return new BTree<T>(result.tree, this.count + 1);
            case 'changed': return new BTree<T>(result.tree, this.count);
            case 'split': return new BTree<T>(new TreeNode<T>(MAX_TREE_KEY_COUNT, [result.value], [ result.left, result.right ], this.root.comparer), this.count + 1);
        }
    }

    remove(value: T) {
        let result = this.root.remove(value);
        if(result.result === 'nochange') return this;
        if(result.needMerge) {
            let newRoot = result.tree.tryGetSingleChild() ?? result.tree;
            return new BTree<T>(newRoot, this.count - 1);
        }
        return new BTree<T>(result.tree, this.count - 1);
    }

    toArray(): T[] {
        return this.root.toArray();
    }
}

export interface ITreeNode<T> {
    comparer: (a: T, b: T) => number;

    maxKeyCount: number;
    values: T[];

    add(value: T): AddOrSetResult<T>;
    set(value: T): AddOrSetResult<T>;
    remove(value: T): RemoveResult<T>;
    removeMax(): { result: 'removed', tree: ITreeNode<T>, value: T, needMerge: boolean };
    has(value: T): boolean;
    get(value: T): T|undefined;

    max(): T;
    min(): T;

    tryRotateMin(): { value: T, leftOrphan?: ITreeNode<T>, tree: ITreeNode<T> } | undefined;
    tryRotateMax(): { value: T, rightOrphan?: ITreeNode<T>, tree: ITreeNode<T> } | undefined;
    // Called for rotate operations. MAY MODIFY THE TREE IN-PLACE WITHOUT A COPY
    // we can do that safely because this is only called on trees generated during a remove() call
    prepend(value: T, orphan?: ITreeNode<T>): void;
    append(value: T, orphan?: ITreeNode<T>): void;

    merge(divider: T, other: ITreeNode<T>): ITreeNode<T>;

    tryGetSingleChild(): ITreeNode<T> | undefined;

    toArray(): T[];
}

export type AddOrSetResult<T> = 
    { result: 'nochange'} | 
    { result: 'added', tree: ITreeNode<T> } | 
    { result: 'changed', tree: ITreeNode<T> } | 
    { result: 'split', value: T, left: ITreeNode<T>, right: ITreeNode<T>}

export type RemoveResult<T> =
    { result: 'nochange' } |
    { result: 'removed', tree: ITreeNode<T>, value: T, needMerge: boolean }