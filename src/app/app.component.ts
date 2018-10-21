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
  name: string;

  constructor(private cardsService: CardsService) { }

  submit(id, name) {
    this.cardsService.createRoom(id, name)
      .then(() => {
        this.roomId = id;
        this.name = name;
      })
  }
}
