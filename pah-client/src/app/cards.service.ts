import { Injectable } from '@angular/core';
import { cards } from './cards.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  cards: any;
  usedCards = [];
  blackCards = [];
  whiteCards = [];

  constructor(private http: HttpClient) { }

  createRoom(id, name) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.post('https://partycards.localtunnel.me/api/room', { id: id.toLowerCase(), name: name.toLowerCase() })
        .subscribe((response: any) => {
          resolve();
        });
    });
  }

  getRoomInfo(roomId): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase())
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  startGame(roomId) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase() + '/start')
        .subscribe((response: any) => {
          resolve();
        });
    });
  }

  getWaitingPlayers(roomId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getRoomInfo(roomId)
        .then(response => {
          const players = response.players;
          const submissions = response.submissions;
          players.splice(response.activePlayer, 1);
          for (let submission of submissions) {
            let i = players.indexOf(submission.name);
            if (i > -1) {
              players.splice(i, 1);
            }
          }
          resolve(players);
        })
    });
  }

  getCards() {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/cards')
        .subscribe((response: any) => {
          self.cards = response.data;
          self.blackCards = self.cards.blackCards;
          self.whiteCards = self.cards.whiteCards;
          resolve();
        });
    });
  }

  getWhiteCards(roomId, num): Promise<any[]> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase() + '/cards-white/' + num)
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  getBlackCard(roomId): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase() + '/cards-black')
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  getNewBlackCard(roomId): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase() + '/cards-black/new')
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  submitWhiteCards(cards, roomId, player) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.post('http://partycards.localtunnel.me/api/room/' + roomId.toLowerCase() + '/submit-white', { cards: cards, name: player.toLowerCase() })
        .subscribe((response: any) => {
          resolve();
        });
    });
  }

  getSubmissions(roomId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getRoomInfo(roomId)
        .then(response => {
          const submissions = [];
          for (let item of response.submissions) {
            submissions.push(item.card);
          }
          resolve(submissions);
        })
    });
  }
}
