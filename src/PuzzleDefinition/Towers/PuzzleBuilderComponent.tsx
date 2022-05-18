import * as React from 'react';
import { range } from '../../ArrayExtensions';
import Tree from '../../Tree';
import IPuzzleRules from '../IPuzzleRules';
import TowersRules, { ITowersViolation } from './TowersRules';
import './PuzzleBuilder.css';

export default function PuzzleBuilderComponent(props: {onFinished: (rules: IPuzzleRules<number, ITowersViolation>, board: Tree<number[]>) => void}) {
    const [boardSize, setBoardSize] = React.useState(5);
    const [board, setBoard] = React.useState(new Tree<number[]>(range(0, boardSize * boardSize).map(() => range(1, boardSize))));
    
    const [rowEyes, setRowEyes] = React.useState(range(0, boardSize).map(() => ({fwd: -1, rev: -1})));
    const [colEyes, setColEyes] = React.useState(range(0, boardSize).map(() => ({fwd: -1, rev: -1})));

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

    return <div className='container'>
        <div className='header-row'>

        </div>
        <div className='content-row'>
            <div className='board'>
                <EyeRowComponent eyes={colEyes} fwd={true} />
                {range(0, boardSize).map(row => <BoardRowComponent key={row} row={row} boardSize={boardSize} board={board} rowEyes={rowEyes} />)}
                <EyeRowComponent eyes={colEyes} fwd={false} />
            </div>
        </div>
        <div className='footer-row'>
            <button onClick={() => props.onFinished(getRules(), board)}>Solve</button>
        </div>
    </div> 
    
    
}

function EyeRowComponent(props: {eyes: {fwd: number, rev: number}[], fwd: boolean}) {
    const values = props.eyes.map(eye => props.fwd ? eye.fwd : eye.rev);
    return <div className='board-row'>
        <EyeCellComponent value={-1} />
        {values.map((value, col) => <EyeCellComponent key={col} value={value} />)}
        <EyeCellComponent value={-1} />
    </div>
}

function BoardRowComponent(props: {board: Tree<number[]>, boardSize: number, row: number, rowEyes: {fwd: number, rev: number}[]}) {
    const eyes = props.rowEyes[props.row];
    const values = range(0, props.boardSize).map(col => props.board.get(props.row * props.boardSize + col));
    return <div className='board-row'>
        <EyeCellComponent value={eyes.fwd} />
        {values.map((value, col) => <BoardCellComponent key={col} value={value} />)}
        <EyeCellComponent value={eyes.rev} />
    </div>
}

function EyeCellComponent(props: {value: number}) {
    if(props.value === -1) {
        return <div className='eye-cell empty' />
    }
    return <div className="eye-cell">{props.value}</div>;
}

function BoardCellComponent(props: {value: number[]}) {
    if(props.value.length === 1) {
        return <div className='board-cell board-value'>{props.value[0]}</div>
    }
    else {
        return <div className='board-cell'>{props.value.map(v => <span key={v} className='board-possible-value'>{v}</span>)}</div>
    }
}