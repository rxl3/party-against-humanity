import { Injectable } from '@angular/core';
import { cards } from './cards.enum';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  usedCards = [];
  blackCards = cards.blackCards;
  whiteCards = cards.whiteCards;

  constructor() { }

  getCards(): object {
    return cards;
  }

  getNumWhiteCards(num: number) {
    const cardSet = [];
    for (let i = 0; i < num; i++) {
      let rand = Math.floor(Math.random() * this.whiteCards.length);
      while (this.usedCards.indexOf(this.whiteCards[rand]) > -1) {
        rand = Math.floor(Math.random() * this.whiteCards.length);
      }
      cardSet.push(this.whiteCards[rand]);
      this.usedCards.push(this.whiteCards[rand]);
    }
    return cardSet;
  }

  getBlackCard() {
    let blackCard = null;
    let rand = Math.floor(Math.random() * this.blackCards.length);
    while (this.usedCards.indexOf(this.blackCards[rand].text) > -1) {
      rand = Math.floor(Math.random() * this.blackCards.length);
    }
    blackCard = this.blackCards[rand];
    this.usedCards.push(blackCard.text);
    blackCard.text = blackCard.text.replace(/_/g, '_____');
    return blackCard;
  }
}
