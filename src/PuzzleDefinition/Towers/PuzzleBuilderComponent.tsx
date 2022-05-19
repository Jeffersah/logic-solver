import * as React from 'react';
import { range } from '../../ArrayExtensions';
import Tree from '../../Tree';
import IPuzzleRules from '../IPuzzleRules';
import TowersRules, { ITowersViolation } from './TowersRules';
import './PuzzleBuilder.css';
import useResizeObserver from '@react-hook/resize-observer';
import useSize from '../../Hooks/useSize';

export default function PuzzleBuilderComponent(props: {onFinished: (rules: IPuzzleRules<number, ITowersViolation>, board: Tree<number[]>) => void}) {
    const [boardSize, setBoardSize] = React.useState(5);
    const [board, setBoard] = React.useState(new Tree<number[]>(range(0, boardSize * boardSize).map(() => range(1, boardSize))));
    
    const [rowEyes, setRowEyes] = React.useState(range(0, boardSize).map(() => ({fwd: 0, rev: 0})));
    const [colEyes, setColEyes] = React.useState(range(0, boardSize).map(() => ({fwd: 0, rev: 0})));

    function changeBoardSize(newSize: number) {
        setBoardSize(newSize);
        setBoard(new Tree<number[]>(range(0, newSize * newSize).map(() => range(1, newSize))));
    }

    function getRules(): TowersRules {
        const eyes = [];
        for(let i = 0; i < boardSize; i++) {
            if(rowEyes[i].fwd !== -1) {
                eyes.push({ value: rowEyes[i].fwd, from: {x: 0, y: i}, direction: {x: 1, y: 0} })
            }
            if(rowEyes[i].rev !== -1) {
                eyes.push({ value: rowEyes[i].rev, from: {x: boardSize-1, y: i}, direction: {x: -1, y: 0} })
            }
            if(colEyes[i].fwd !== -1) {
                eyes.push({ value: colEyes[i].fwd, from: {x: i, y: 0}, direction: {x: 0, y: 1} })
            }
            if(colEyes[i].rev !== -1) {
                eyes.push({ value: colEyes[i].rev, from: {x: i, y: boardSize-1}, direction: {x: 0, y: -1} })
            }
        }
        return new TowersRules(boardSize, eyes);
    }

    function recalculateCellValues(x: number, y: number, board: Tree<number[]>) {
        const currentValue = board.get(x + y * boardSize);
        if(currentValue.length === 1) return board;
        const newValue = range(1, boardSize);

        function rmValue(v: number[]) {
            if(v.length === 1){
                var i = newValue.indexOf(v[0]);
                if(i != -1) newValue.splice(i, 1);
            }
        }

        for(let i = 0; i < boardSize; i++) {
            rmValue(board.get(x + i * boardSize));
            rmValue(board.get(i + y * boardSize));
        }
        return board.set(x + y * boardSize, newValue);
    }

    function setBoardValue(x: number, y: number, value?: number) {
        const realValue = value === undefined ? range(1, boardSize) : [value];

        let newBoard = (board.set(x + y * boardSize, realValue));
        // Recalculate affected cells
        for(let i = 0; i < boardSize; i++) {
            newBoard = recalculateCellValues(x, i, newBoard);
            newBoard = recalculateCellValues(i, y, newBoard);
        }

        setBoard(newBoard);
    }

    const boardResizeTarget = React.useRef<HTMLDivElement>(null);
    const {width, height} = useSize(boardResizeTarget);
    console.log(width, height);
    const cellSize = Math.min(width, height) / (boardSize + 2);
    const fixedSize = {
        width: Math.floor(cellSize) + "px",
        height: Math.floor(cellSize) + "px",
    };

    return <div className='container'>
        <div className='row header-row'>

        </div>
        <div className='row content-row' ref={boardResizeTarget}>
            <table className='board' style={{ width: Math.min(width, height) + 'px'}}>
                <EyeRowComponent eyes={colEyes} fwd={true} boardSize={boardSize} fixedSize={fixedSize} />
                {range(0, boardSize).map(row => <BoardRowComponent key={row} row={row} boardSize={boardSize} board={board} rowEyes={rowEyes} fixedSize={fixedSize} />)}
                <EyeRowComponent eyes={colEyes} fwd={false} boardSize={boardSize} fixedSize={fixedSize} />
            </table>
        </div>
        <div className='row footer-row'>
            <button onClick={() => props.onFinished(getRules(), board)}>Solve</button>
        </div>
    </div> 
}

function EyeRowComponent(props: {eyes: {fwd: number, rev: number}[], fwd: boolean, boardSize: number, fixedSize: {width: string, height: string}}) {
    const values = props.eyes.map(eye => props.fwd ? eye.fwd : eye.rev);
    return <tr className='board-row' style={{verticalAlign: (props.fwd ? "bottom" : "top") }}>
        <EyeCellComponent value={-1} fixedSize={props.fixedSize} />
        {values.map((value, col) => <EyeCellComponent key={col} value={value} fixedSize={props.fixedSize} />)}
        <EyeCellComponent value={-1} fixedSize={props.fixedSize} />
    </tr>
}

function BoardRowComponent(props: {board: Tree<number[]>, boardSize: number, row: number, rowEyes: {fwd: number, rev: number}[], fixedSize: {width: string, height: string}}) {
    const eyes = props.rowEyes[props.row];
    const values = range(0, props.boardSize).map(col => props.board.get(props.row * props.boardSize + col));
    return <tr className='board-row'>
        <EyeCellComponent value={eyes.fwd} fixedSize={props.fixedSize} />
        {values.map((value, col) => <BoardCellComponent key={col} value={value} fixedSize={props.fixedSize} />)}
        <EyeCellComponent value={eyes.rev} fixedSize={props.fixedSize} />
    </tr>
}

function EyeCellComponent(props: {value: number, fixedSize: {width: string, height: string}}) {
    if(props.value === -1) {
        return <td className='cell eye-cell' style={props.fixedSize}></td>
    }
    return <td className="cell eye-cell" style={props.fixedSize}>{props.value}</td>;
}

function BoardCellComponent(props: {value: number[], fixedSize: {width: string, height: string}}) {
    if(props.value.length === 1) {
        return <td className='cell board-cell board-value' style={props.fixedSize}>{props.value[0]}</td>
    }
    else {
        return <td className='cell board-cell' style={props.fixedSize}>{props.value.map(v => <span key={v} className='board-possible-value'>{v}</span>)}</td>
    }
}