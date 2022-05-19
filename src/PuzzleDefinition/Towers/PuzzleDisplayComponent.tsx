import * as React from 'react';
import Tree from '../../Tree';
import IPuzzleRules from '../IPuzzleRules';
import { ITowersViolation } from './TowersRules';

export default function PuzzleDisplayComponent(props: {rules: IPuzzleRules<number, ITowersViolation>, board: Tree<number[]>}) {
    return <div></div>
}