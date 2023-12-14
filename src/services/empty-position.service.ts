import { Injectable } from '@angular/core';
import { Position, isSamePosition } from '../utils/position';

@Injectable({
  providedIn: 'root'
})
export class EmptyPositionService {
  position = new Position(0, 0);

  getPosition() {
    return this.position;
  }

  setPosition(position: Position) {
    this.position = position;
  }

}
