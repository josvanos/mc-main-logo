import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleBoard } from '../components/puzzle-board/puzzle-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PuzzleBoard],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }
