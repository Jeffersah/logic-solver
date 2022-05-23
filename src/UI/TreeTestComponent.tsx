import * as React from 'react';
import BTree, { ITreeNode } from '../Immutable/Tree/BTree';
import { TreeNode } from '../Immutable/Tree/TreeNode';

export default function TreeTestComponent() {
    const [tree, setTree] = React.useState(BTree.empty<number>((a, b) => a-b));
    const [formVal, setFormVal] = React.useState<number>(0);

    return <div>
        <div style={{color: 'white'}}>
            <TreeComponent node={(tree as any).root} />
        </div>
        <div>
            <input type='number' value={formVal} onChange={ev => setFormVal(ev.target.valueAsNumber)}></input>
            <button>Test</button>
            <button onClick={()=>setTree(tree.add(formVal))}>Add</button>
            <button onClick={()=>setTree(tree.remove(formVal))}>Remove</button>
        </div>
    </div>
}

function TreeComponent(props: { node: ITreeNode<number> }) {
    let children = <></>;
    if(props.node instanceof TreeNode) {
        children = <>{props.node.children.map((ch, i) => <TreeComponent key={i} node={ch} />)}</>;
    }
    return <div>
        <div>
            {props.node.values.map((v, i) => <span key={i} style={{paddingRight: '4px'}}>{v}</span>)}
        </div>
        <div style={{ border: '0px solid white', borderLeftWidth: '2px', paddingLeft: '8px'}}>
            {children}
        </div>
    </div>
}