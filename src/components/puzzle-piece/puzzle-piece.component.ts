import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EmptyPositionService } from "../../services/empty-position.service";

import { Position, isAdjecent, isSamePosition } from "../../utils/position";
import { NgClass } from "@angular/common";

export interface IPuzzlePiece {
    imagePosition: Position;
    index: number;
}

@Component({
    standalone: true,
    selector: 'puzzle-piece',
    imports: [NgClass],
    templateUrl: "./puzzle-piece.component.html",
    styleUrl: "./puzzle-piece.component.css",
})
export class PuzzlePiece {
    @Input() index!: number;
    @Input() imagePosition!: Position;
    boardPosition!: Position;

    @Input("boardPosition")
    set _boardPosition({ x, y }: { x: number, y: number }) {
        this.boardPosition = new Position(x, y);
    }

    @Output() onMoveRequest: EventEmitter<Position> = new EventEmitter();

    constructor(private emptyPositionService: EmptyPositionService) { }
    // logic for shaking
    private timeoutId: any;
    isShaking: boolean = false;

    // controls the [ngClass] attribute to shake
    shake() {
        this.isShaking = true;

        this.timeoutId = setTimeout(() => {
            this.isShaking = false;
        }, 1000)
    }

    // Cleans up the timeout when the component is destroyed
    ngOnDestroy() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    }

    // sets the background-color of the piece index
    getIndexStyles() {
        return {
            'background-color': isSamePosition(this.boardPosition, this.imagePosition) ? 'green' : 'red'
        };
    }

    // sets the image postition correctly
    getCutImageStyles() {
        return {
            'background-position': `-${this.imagePosition.x * 150}px -${this.imagePosition.y * 150}px`
        }
    }

    // Allows the user to move a piece when it is adjecent
    requestToMovePiece() {
        const emptyPosition = this.emptyPositionService.getPosition();
        if (!isAdjecent(emptyPosition, this.boardPosition)) {
            this.shake();
            return;
        };

        this.onMoveRequest.emit(this.boardPosition);
    }


}   
