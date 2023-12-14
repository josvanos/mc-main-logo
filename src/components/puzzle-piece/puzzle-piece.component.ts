import { Component, EventEmitter, Input, Output, numberAttribute } from "@angular/core";
import { EmptyPositionService } from "../../services/empty-position.service";


import { ShakeDirective } from "../../directives/shake.directive";
import { Position, isAdjecent, isSamePosition } from "../../utils/position";

export interface IPuzzlePiece {
    imagePosition: Position;
    index: number;
}

@Component({
    standalone: true,
    selector: 'puzzle-piece',
    imports: [ShakeDirective],
    templateUrl: "./puzzle-piece.component.html",
    styleUrl: "./puzzle-piece.component.css",
})
export class PuzzlePiece {
    // work around for { ...props } syntax in JSX or :v-bind="$props" in Vue
    index!: number;
    imagePosition!: Position;

    @Input("item")
    set _item(item: IPuzzlePiece) {
        this.index = item.index;
        this.imagePosition = item.imagePosition;
    }

    boardPosition!: Position;

    @Input("boardPosition")
    set _boardPosition({ x, y }: { x: number, y: number }) {
        this.boardPosition = new Position(x, y);
    }

    @Output() onMoveRequest: EventEmitter<Position> = new EventEmitter();


    private timeoutId: any;
    isShaking: boolean = false;

    constructor(private emptyPositionService: EmptyPositionService) { }

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

    // controls the [appShake] directive
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
