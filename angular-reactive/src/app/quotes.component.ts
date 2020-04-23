import { Component } from '@angular/core';

import { Quote } from './quote';
import { QuoteReactiveService } from './quote-reactive.service';
import { QuoteBlockingService } from './quote-blocking.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-component-quotes',
  providers: [QuoteReactiveService],
  templateUrl: './quotes.component.html'
})
export class QuotesComponent {
  quotes: Observable<Quote[]>;
  selectedQuote: Quote;
  mode: String;
  pagination: boolean;
  page: number;
  size: number;

  constructor(private quoteReactiveService: QuoteReactiveService, private quoteBlockingService: QuoteBlockingService) {
    this.mode = "reactive";
    this.pagination = true;
    this.page = 0;
    this.size = 50;
  }

  requestQuoteStream(): void {
    if (this.pagination === true) {
      this.quotes = this.quoteReactiveService.getQuoteStream(this.page, this.size);
    } else {
      this.quotes = this.quoteReactiveService.getQuoteStream();
    }
  }

  requestQuoteBlocking(): void {
    if (this.pagination === true) {
      this.quotes = this.quoteBlockingService.getQuotes(this.page, this.size);
    } else {
      this.quotes = this.quoteBlockingService.getQuotes();
    }
  }

  onSelect(quote: Quote): void {
    this.selectedQuote = quote;
  }

  deleteQuote(): void {
    if (this.selectedQuote != null) {
      this.quoteBlockingService.deleteQuote(this.selectedQuote.id).subscribe(() => console.log("Quote " + this.selectedQuote.id + " deleted"));
    }
  }

  deleteStream(): void {
      // TODO In a reactive way remove quotes when they have been deleted by reactive backend by successful response
      // When error response do not remove
      this.quoteReactiveService.deleteQuote(this.selectedQuote.id);
  }
}
