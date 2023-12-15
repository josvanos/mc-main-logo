import { Component, Input, numberAttribute, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IPuzzlePiece, PuzzlePiece } from "../puzzle-piece/puzzle-piece.component";
import { EmptyPositionService } from "../../services/empty-position.service";
import { shuffleArray } from "../../utils/shuffle";
import { Position, isSamePosition } from "../../utils/position";

type Row = IPuzzlePiece | null;
const EMPTY_PIECE = null;

@Component({
    standalone: true,
    selector: 'puzzle-board',
    imports: [CommonModule, PuzzlePiece],
    templateUrl: "./puzzle-board.component.html",
    styleUrl: "./puzzle-board.component.css"
})
export class PuzzleBoard {
    @Input({ transform: numberAttribute }) numberOfVerticalTiles!: number;
    @Input({ transform: numberAttribute }) numberOfHorizontalTiles!: number;

    endPosition!: Position;
    isFinished = false;

    /**
     * @description a nested list of puzzle pieces 
     * @example // board of 3 x 3
     * [[1,2,3], [4,5,6], [7,8,null]] 
     */
    boardRows = signal<Row[][]>([[]]);

    constructor(private emptyPositionService: EmptyPositionService) { }

    ngOnInit() {
        this.loadBoard();
    }

    // listens to 'move piece' event of any child puzzle piece
    movePiece(position: Position) {

        this.boardRows.update((rows) => {
            const piece = rows[position.y][position.x];
            if (!piece) throw Error('Piece not found on board');

            // update the empty location and temporary store the old one
            const emptyPosition = this.emptyPositionService.getPosition();
            this.emptyPositionService.setPosition(position);

            // swap empty and piece position
            rows[position.y][position.x] = EMPTY_PIECE;
            rows[emptyPosition.y][emptyPosition.x] = piece;

            return rows;
        });

        // side effect: check if the position is winning
        this.checkWinningPosition();
    }

    // check if the puzzle is completed
    checkWinningPosition() {

        // first check if the empty slot is at his end location
        const emptyPosition = this.emptyPositionService.getPosition();
        if (!isSamePosition(emptyPosition, this.endPosition)) return;

        // check if every piece image position matches the board position 
        for (const [y, row] of this.boardRows().entries()) {
            for (const [x, piece] of row.entries()) {
                if (piece === EMPTY_PIECE) continue;

                const position = new Position(x, y);
                if (!isSamePosition(position, piece.imagePosition)) return;
            }
        }

        this.isFinished = true;
    }

    // loads the puzzle pieces, empty location and end position
    loadBoard() {
        const numberOfTiles = this.numberOfHorizontalTiles * this.numberOfVerticalTiles
        const numberOfPieces = numberOfTiles - 1; // takes empty slot into account by -1

        // divide the image in images with an image position and index 
        const images: Row[] = [];
        for (let i = 0; i < numberOfPieces; i++) {
            const x = i % this.numberOfVerticalTiles;
            const y = Math.floor(i / this.numberOfVerticalTiles);

            const piece: Row = {
                index: i,
                imagePosition: new Position(x, y),
            }

            images.push(piece);
        }

        // shuffle the images
        shuffleArray(images);

        // build the board by assigning images to a board location
        const rows: Row[][] = [];
        for (let y = 0; y < this.numberOfVerticalTiles; y++) {
            const row = []
            for (let x = 0; x < this.numberOfHorizontalTiles; x++) {
                const index = y * this.numberOfVerticalTiles + x;

                // get puzzle piece at this location
                const image = images[index];
                row.push(image);
            }
            rows.push(row);
        }

        // remove the item on the last place and set it at endPosition
        const endPosition = new Position(this.numberOfHorizontalTiles - 1, this.numberOfVerticalTiles - 1);
        rows[endPosition.y][endPosition.x] = EMPTY_PIECE;

        // set end position, empty position and board rows
        this.endPosition = endPosition;
        this.emptyPositionService.setPosition(this.endPosition);
        this.boardRows.set(rows);
    }
}


