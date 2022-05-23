import IPuzzleBuilder from "../PuzzleDefinition/IPuzzleBuilder";
import "../App.css";
import * as React from "react";
import useSize from "../Hooks/useSize";

export default function PuzzleBuilderComponent(props: { builder: IPuzzleBuilder<any, any>, allBuilders: IPuzzleBuilder<any, any>[], puzzleBuilderChanged: (builder: IPuzzleBuilder<any, any>) => void }) {
    const [state, setState] = React.useState(props.builder.initialBuilderState);
    
    const PanelComponent = props.builder.builderPanelComponent;
    const BodyComponent = props.builder.builderDisplayComponent;
    const bodyRef = React.useRef<HTMLDivElement>(undefined as any as HTMLDivElement);
    const size = useSize(bodyRef);

    return (
        <div className="App">
            <div className='AppPanel'>
                <div className="AppPanelContent">
                    <span>Type: </span>
                    <select onChange={ev => props.puzzleBuilderChanged(props.allBuilders[ev.target.selectedIndex])} value={props.builder.name}>
                        {props.allBuilders.map(builder => 
                            <option key={builder.name}>{builder.name}</option>)}
                    </select>
                    <PanelComponent state={state} setState={setState} />
                </div>
                <div className="AppPanelFooter">
                    <button>Finalize</button>
                </div>
            </div>
            <div className="AppBody" ref={bodyRef}>
                <BodyComponent state={state} setState={setState} maxWidth={size.width} maxHeight={size.height} />
            </div>
        </div>
    );
}