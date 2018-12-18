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
  startGame = false;
  players = [];
  activePlayer = false;
  error;

  constructor(private cardsService: CardsService) { }

  submit(id, name) {
    this.error = "SUBMIT PRESSED";
    this.cardsService.createRoom(id, name)
      .then(() => {
        this.roomId = id;
        this.name = name;
        this.pingGameRoom();
      })
  }

  pingGameRoom() {
    const self = this;
    this.cardsService.getRoomInfo(this.roomId)
      .then((response) => {
        console.log(response);
        this.players = response.players;
        this.startGame = response.startGame;
        this.activePlayer = response.activePlayer === this.name.toLowerCase();
        if (!this.startGame) {
          setTimeout(() => { self.pingGameRoom() }, 3000);
        }
      })
  }

  start() {

    this.cardsService.startGame(this.roomId)
      .then(() => {

      })
  }
}
