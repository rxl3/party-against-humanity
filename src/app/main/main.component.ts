import { Component, OnInit, Input } from '@angular/core';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  cards = [];
  selectedCard;
  blackCardVisible = false;
  selectedBlackCard = { text: '' };
  blackCardFocus = false;
  @Input() activePlayer: boolean;

  constructor(private cardsService: CardsService) { }

  ngOnInit() {
    this.cards = this.cardsService.getNumWhiteCards(10);
  }

  onClick(event) {
    this.blackCardVisible = false;
    const cardText = event.target.innerText;
    let decoded = null;
    let elem = document.createElement('textarea');
    for (let card of this.cards) {
      elem.innerHTML = card;
      decoded = elem.value;
      if (decoded === cardText) {
        this.selectedCard = card;
      }
    }
  }

  getBlackCard() {
    this.selectedBlackCard = this.cardsService.getBlackCard();
    this.blackCardVisible = true;
  }

  toggleCard() {
    this.blackCardVisible = !this.blackCardVisible;
  }

  focusBlackCard() {
    this.blackCardVisible = true;
  }

  focusWhiteCard() {
    this.blackCardVisible = false;
  }
}
