import { ISudokuBuilderState } from ".";
import { IPuzzleBuilderDisplayProps } from "../IPuzzleBuilder";

export default function SudokuBuilderPanelComponent(props: { state: ISudokuBuilderState; setState: (state: ISudokuBuilderState) => void; }) {
    return <div>
        <h4>Alternate Rules:</h4>
        <table style={{border: 'none', borderCollapse: 'collapse'}}>
            <tbody>
            {Object.keys(props.state.toggleRules).map(key =>
                <tr key={key}>
                    <td>{key}</td>
                    <td><input type='checkbox' checked={props.state.toggleRules[key]} onChange={() => 
                        {
                            let newRules = {...props.state.toggleRules};
                            newRules[key] = !newRules[key];
                            props.setState({...props.state, toggleRules: newRules});
                        }}/></td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
}