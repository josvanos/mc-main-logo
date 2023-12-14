import { Component, Input, numberAttribute } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EnumeratePipe } from "../../pipes/EnumeratePipe";
import { IPuzzlePiece, PuzzlePiece } from "../puzzle-piece/puzzle-piece.component";
import { EmptyPositionService } from "../../services/empty-position.service";
import { toShuffledArray } from "../../utils/shuffle";
import { Position, isSamePosition } from "../../utils/position";


@Component({
    standalone: true,
    selector: 'puzzle-board',
    imports: [EnumeratePipe, CommonModule, PuzzlePiece],
    templateUrl: "./puzzle-board.component.html",
    styleUrl: "./puzzle-board.component.css"
})
export class PuzzleBoard {
    @Input({ transform: numberAttribute }) numberOfVerticalTiles!: number;
    @Input({ transform: numberAttribute }) numberOfHorizontalTiles!: number;

    board = new Map<string, IPuzzlePiece>();
    endPosition!: Position;

    isFinished = false;

    constructor(private emptyPositionService: EmptyPositionService) { }

    ngOnInit() {
        this.createPuzzlePieces();
    }

    // helper function to get the piece based on the board x and y
    getPiece(x: number, y: number) {
        const position = new Position(x, y);
        const piece = this.board.get(position.toString());
        return piece;
    }

    // listens to 'move piece' event of any child puzzle piece
    movePiece(position: Position) {
        const piece = this.board.get(position.toString())
        if (!piece) throw Error('Piece not found on board');

        // swap empty position with position of piece
        const emptyPosition = this.emptyPositionService.getPosition();
        this.emptyPositionService.setPosition(position);

        this.board.delete(position.toString())
        this.board.set(emptyPosition.toString(), piece);

        // side effect: check if the position is winning
        this.checkWinningPosition();
    }

    // check if the puzzle is completed
    checkWinningPosition() {
        // first check if the empty slot is at his end location
        const emptyPosition = this.emptyPositionService.getPosition();
        if (!isSamePosition(emptyPosition, this.endPosition)) return;

        // check if every image position matches the board position
        const isInWinningPosition = [...this.board.entries()].every(([key, piece]) => key === piece.imagePosition.toString())
        if (!isInWinningPosition) return;

        this.isFinished = true;
    }

    // loads the puzzle pieces, empty location and end position
    createPuzzlePieces() {
        const numberOfTiles = this.numberOfHorizontalTiles * this.numberOfVerticalTiles

        this.endPosition = new Position(this.numberOfHorizontalTiles - 1, this.numberOfVerticalTiles - 1);
        this.emptyPositionService.setPosition(this.endPosition);

        const numberOfPieces = numberOfTiles - 1;   // the last location is always the empty slot

        // cut the image in positions
        const imagePositions: Position[] = [];
        for (let i = 0; i < numberOfPieces; i++) {
            const x = i % this.numberOfVerticalTiles;
            const y = Math.floor(i / this.numberOfVerticalTiles);

            const position = new Position(x, y);
            imagePositions.push(position)
        }

        // shuffle the image positions
        const boardPositions = toShuffledArray(imagePositions);

        // put each piece on top of the board
        boardPositions.forEach((boardPosition, index) => {
            const puzzlePiece = {
                imagePosition: imagePositions[index],
                index,
            }

            this.board.set(boardPosition.toString(), puzzlePiece);
        });
    }
}


