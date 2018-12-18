import { Component, OnInit, Input } from '@angular/core';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  cards = [];
  submissions = [];
  selectedCard;
  blackCardVisible = false;
  selectedBlackCard = { text: '' };
  blackCardFocus = false;
  numPlayers: number;
  @Input() activePlayer: boolean;
  @Input() roomId: string;
  @Input() playerName: string;

  constructor(private cardsService: CardsService) { }

  ngOnInit() {
    this.cardsService.getPlayerStatus(this.roomId, this.playerName)
      .then((status) => {
        this.activePlayer = status.active;
        if (!this.activePlayer) {
          this.blackCardVisible = true;
        }
        return this.cardsService.getWhiteCards(this.roomId, 10)
      })
      .then(response => {
        this.cards = response;
        if (!this.activePlayer) {
          this.pingBlackCard();
        }
      })
      .catch(err => {
        console.error(err);
      });
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

  submit() {
    this.cardsService.submitWhiteCard(this.selectedCard, this.roomId, this.playerName)
      .then(() => {
        let promise = null;
        if (this.activePlayer) {
          this.submissions = [];
          promise = Promise.resolve();
        } else {
          for (let i = this.cards.length - 1; i >= 0; i--) {
            if (this.cards[i] === this.selectedCard) {
              this.cards.splice(i, 1);
            }
          }
          promise = this.cardsService.getWhiteCards(this.roomId, 10 - this.cards.length);
        }
        return promise;
      })
      .then(() => {
        this.selectedCard = null;
        return this.cardsService.getPlayerStatus(this.roomId, this.playerName);
      })
      .then(playerResponse => {
        this.activePlayer = playerResponse.active;
      })
      .catch(err => {
        console.error(err);
      });
  }

  pingBlackCard() {
    const self = this;
    this.cardsService.getBlackCard(this.roomId)
      .then(response => {
        if (response) {
          console.log(response);
          this.blackCardVisible = true;
          this.selectedBlackCard = response;
        } else {
          setTimeout(() => { self.pingBlackCard() }, 1000);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  getBlackCard() {
    this.cardsService.getNewBlackCard(this.roomId)
      .then(response => {
        this.blackCardVisible = true;
        this.selectedBlackCard = response.card;
        this.numPlayers = response.roomSize;
        this.pingSubmissions();
      })
      .catch(err => {
        console.error(err);
      });
  }

  pingSubmissions() {
    const self = this;
    this.cardsService.getSubmissions(this.roomId)
      .then(submissions => {
        this.submissions = submissions;
        if (this.submissions.length < this.numPlayers - 1) {
          setTimeout(() => { self.pingSubmissions() }, 1000);
        }
      })
      .catch(err => {
        console.error(err);
      });
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
