import { Component } from '@angular/core';
import { MainComponent } from './main/main.component';
import { CardsService } from './cards.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CardsService]
})
export class AppComponent {
  roomId: string;

  constructor() { }

  submit(id) {
    this.roomId = id;
  }
}
