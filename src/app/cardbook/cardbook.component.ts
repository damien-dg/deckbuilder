import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardbookService } from './cardbook.service';
import { DecklistService } from '../decklist/decklist.service';
import { MetadataService } from '../metadata/metadata.service';


@Component({
  selector: 'app-cardbook',
  templateUrl: './cardbook.component.html',
  styleUrls: ['./cardbook.component.scss']
})
export class CardbookComponent implements OnInit {

  data: Array<string> = [];
  error: any;
  backendUrl = "http://localhost:8000"
  page: number = 1;

  constructor(private cardbookService: CardbookService, private decklistService: DecklistService, private metadataService: MetadataService) { }

  getCardUrl(card: string) {
    return this.cardbookService.getCardUrl(card);
  }
  ngOnInit() {
    this.showCards(1);
  }

  addCardToDecklist(card: string) {
    card = card.split("/")[card.split("/").length - 1];
    let currentCard = this.metadataService.metadata.get(card);
    if (currentCard) {
      let maxCopiesInDeck = currentCard.get("max_copies_in_deck") || 0;
      let deckCard = this.decklistService.decklist.get(card);
      if (!deckCard) {
        this.decklistService.decklist.set(card, 1)
      }
      else if (deckCard < maxCopiesInDeck) {
        this.decklistService.decklist.set(card, deckCard + 1)
      }
    }
  }

  showCards(page: number) {
    if (page >= 1) {
      this.page = page
      this.cardbookService.getCards(this.page)
        .subscribe({
          next: (data: Array<string>) => this.data = data, // success path
          error: (error => this.error = error) // error path
        });

    }
  }
}
