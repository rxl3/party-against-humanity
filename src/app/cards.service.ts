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
      this.http.post('http://localhost:8000/api/room', { id: id, name: name })
        .subscribe((response: any) => {
          resolve();
        });
    });
  }

  getCards() {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/cards')
        .subscribe((response: any) => {
          self.cards = response.data;
          self.blackCards = self.cards.blackCards;
          self.whiteCards = self.cards.whiteCards;
          resolve();
        });
    });
  }

  getPlayerStatus(roomId, name): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/room/' + roomId + '/player/' + name)
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  getWhiteCards(roomId, num): Promise<any[]> {
    // const cardSet = [];
    // for (let i = 0; i < num; i++) {
    //   let rand = Math.floor(Math.random() * this.whiteCards.length);
    //   while (this.usedCards.indexOf(this.whiteCards[rand]) > -1) {
    //     rand = Math.floor(Math.random() * this.whiteCards.length);
    //   }
    //   cardSet.push(this.whiteCards[rand]);
    //   this.usedCards.push(this.whiteCards[rand]);
    // }
    // return cardSet;
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/room/' + roomId + '/cards-white/' + num)
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  getBlackCard(roomId): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/room/' + roomId + '/cards-black')
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  getNewBlackCard(roomId): Promise<any> {
    // let blackCard = null;
    // let rand = Math.floor(Math.random() * this.blackCards.length);
    // while (this.usedCards.indexOf(this.blackCards[rand].text) > -1) {
    //   rand = Math.floor(Math.random() * this.blackCards.length);
    // }
    // blackCard = this.blackCards[rand];
    // this.usedCards.push(blackCard.text);
    // blackCard.text = blackCard.text.replace(/_/g, '_____');
    // return blackCard;
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/room/' + roomId + '/cards-black/new')
        .subscribe((response: any) => {
          resolve(response.data);
        });
    });
  }

  submitWhiteCard(card, roomId, player) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8000/api/room/' + roomId + '/submit-white', { card: card, name: player })
        .subscribe((response: any) => {
          resolve();
        });
    });
  }

  getSubmissions(roomId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/room/' + roomId + '/submissions')
        .subscribe((response: any) => {
          const submissions = [];
          for (let item of response.data) {
            submissions.push(item.card);
          }
          resolve(submissions);
        })
    });
  }
}
