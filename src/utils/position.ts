
export class Position {

    constructor(public x: number, public y: number) { }

    /**
    * @description stringifies the position to `x@y`
    * @example
    *   const position = new Position(1,2)
    *   position.toString() // => '1@2'
    *    
    */
    toString() {
        return `${this.x}@${this.y}`;
    }
}


export function isSamePosition(pos1: Position, pos2: Position) {
    return pos1.toString() == pos2.toString()
}

export function isAdjecent(pos1: Position, pos2: Position) {
    const horizontalChange = Math.abs(pos1.x - pos2.x);
    const verticalChange = Math.abs(pos1.y - pos2.y);
    return (horizontalChange + verticalChange) === 1
}