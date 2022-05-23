import React from "react";
import Sudoku, { Alphabet, ISudokuBuilderState } from ".";
import CellGridComponent, { IGridCellProps } from "../../UI/CellGridComponent";
import { IPuzzleBuilderDisplayProps } from "../IPuzzleBuilder";

const ArrowDirs = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
}

export default function SudokuBuilderDisplayComponent(props: IPuzzleBuilderDisplayProps<ISudokuBuilderState>) {

    let grid:IGridCellProps[][] = [];
    for(let i = 0; i < props.state.boardSize; i++) { grid[i] = []; }
    for(let x = 0; x < props.state.boardSize; x++){

        let thickLeftBorder = x % props.state.sqSize === 0;
        let thickRightBorder = x % props.state.sqSize === props.state.sqSize - 1;

        for(let y = 0; y < props.state.boardSize; y++){

            let thickTopBorder = y % props.state.sqSize === 0;
            let thickBottomBorder = y % props.state.sqSize === props.state.sqSize - 1;
            const valueIndex = props.state.givens.get({x, y});

            grid[x][y] = {
                displayBorder: true,
                knownValue: valueIndex === undefined ? undefined : Alphabet[valueIndex],
                highlight: props.state.selected?.x === x && props.state.selected?.y === y,
                borderThickness: [
                    thickTopBorder ? 6 : 1,
                    thickRightBorder ? 6 : 1,
                    thickBottomBorder ? 6 : 1,
                    thickLeftBorder ? 6 : 1,
                ]
            };
        }
    }

    function handleClick(x: number, y: number) {
        props.setState(
            {...props.state, selected: {x, y}},
        )
    }

    function handleKey(ev:React.KeyboardEvent<HTMLDivElement> ) {
        if(Alphabet.indexOf(ev.key) !== -1 && Alphabet.indexOf(ev.key) < props.state.boardSize && props.state.selected !== undefined) {
            props.setState({
                ...props.state,
                givens: props.state.givens.set(props.state.selected, Alphabet.indexOf(ev.key)),
            })
            ev.preventDefault();
            return;
        }
        switch(ev.key) {
            case 'Escape':
                props.setState({...props.state, selected: undefined});
                ev.preventDefault();
                return;
            case 'Delete':
            case 'Backspace':
                if(props.state.selected !== undefined) {
                    props.setState({...props.state, givens: props.state.givens.remove(props.state.selected)});
                    ev.preventDefault();
                }
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                let [dx, dy] = ArrowDirs[ev.key];
                if(ev.shiftKey) {
                    dy *= props.state.sqSize;
                    dx *= props.state.sqSize;
                }
                if(props.state.selected !== undefined) {
                    props.setState({...props.state, selected: {
                        x: Math.max(0, Math.min(props.state.boardSize - 1, props.state.selected.x + dx)),
                        y: Math.max(0, Math.min(props.state.boardSize - 1, props.state.selected.y + dy))
                    }});
                    ev.preventDefault();
                }
                break;
            case 'Tab':
                if(props.state.selected !== undefined) {
                    if(props.state.selected.x < props.state.boardSize - 1) {
                        props.setState({...props.state, selected: {x: props.state.selected.x + 1, y: props.state.selected.y}});
                    }
                    else if(props.state.selected.y < props.state.boardSize - 1) {
                        props.setState({...props.state, selected: {x: 0, y: props.state.selected.y + 1}});
                    }
                    ev.preventDefault();
                }
                break;
            
        }
    }

    return <div onKeyDown={handleKey} tabIndex={0}>
        <CellGridComponent sqSize={Math.min(props.maxWidth, props.maxHeight) / props.state.boardSize} grid={grid} onClick={handleClick} />
    </div>
}