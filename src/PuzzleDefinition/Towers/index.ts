import IUIPuzzleDefinition from "../../UI/IUIPuzzleDefinition";
import PuzzleBuilderComponent from "./PuzzleBuilderComponent";
import PuzzleDisplayComponent from "./PuzzleDisplayComponent";
import { ITowersViolation } from "./TowersRules";

const definition: IUIPuzzleDefinition<number, ITowersViolation> = {
    name: "Towers",
    createPuzzleBuilder: () => PuzzleBuilderComponent,
    createPuzzleView: () => PuzzleDisplayComponent
}

export default definition;