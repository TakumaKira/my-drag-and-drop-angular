import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';

import { State } from 'src/app/store';
import { Card } from 'src/app/store/card.model';
import { selectCardEntity } from 'src/app/store/card.selectors';
import { OrderList } from 'src/app/store/order.reducer';
import { selectOrderLists, selectOrderState } from 'src/app/store/order.selectors';
import * as CardActions from '../../store/card.actions';
import * as OrderActions from '../../store/order.actions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() listIndex!: number;
  @Input() cardIndex!: number;
  @Input() cardId!: string;
  @HostBinding('draggable') draggable = true;
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  private orderList$: Observable<OrderList[]>;
  private mouseIsDown = false;

  constructor(
    private store: Store<State>,
  ) {
    this.orderList$ = this.store.pipe(
      select(selectOrderLists),
      distinctUntilChanged(isEqual),
    );
  }
  @HostListener('mousedown')
  onMouseDown(): void {
    this.content.nativeElement.focus(); // prevent blur when content is already focused
    this.mouseIsDown = true;
  }
  @HostListener('mousemove')
  onMouseMove(): void {
    if (this.mouseIsDown) {
      this.content.nativeElement.style.pointerEvents = 'none'; // disable edit to enable drag
    }
  }
  @HostListener('mouseup')
  onMouseUp(): void {
    this.mouseIsDown = false;
  }
  @HostListener('click')
  onClick(): void {
    this.content.nativeElement.focus();
    this.content.nativeElement.style.pointerEvents = 'auto'; // enable text selector
  }
  focusout(): void {
    this.content.nativeElement.style.pointerEvents = 'none';
    this.updateCardContent();
  }
  private updateCardContent(): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      // tslint:disable-next-line:max-line-length
      filter(order => order.draggingCard === null), // Prevent executing this when starting dragging a card(thus dragged card content remains)
    ).subscribe(() => {
      const content = this.content.nativeElement;
      const { textContent } = content;
      if (!textContent) {
        if (confirm('Are you sure you want to delete this card?')) {
          this.orderList$.pipe(first()).subscribe(lists =>
            // tslint:disable-next-line:max-line-length
            this.store.dispatch(CardActions.deleteCard({listId: lists[this.listIndex].listId, cardId: lists[this.listIndex].cardIds[this.cardIndex]})));
        } else {
          this.store.pipe(first()).subscribe(state =>
            content.textContent = state.cards.entities[state.order.lists[this.listIndex].cardIds[this.cardIndex]]?.content as string);
        }
        return;
      }
      this.orderList$.pipe(first()).subscribe(lists =>
        this.store.dispatch(CardActions.updateCard({ cardId: lists[this.listIndex].cardIds[this.cardIndex], contents: textContent })));
    });
  }
  @HostListener('dragstart')
  onDragStart(): void {
    this.store.dispatch(OrderActions.updateMovingCard({index: [this.listIndex, this.cardIndex]}));
  }
  @HostListener('dragenter')
  onDragEnter(): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingList === null),
      filter(order => order.draggingCard !== null),
      // tslint:disable-next-line:max-line-length
      filter(order => (order.draggingCard as [number, number])[0] !== this.listIndex || (order.draggingCard as [number, number])[1] !== this.cardIndex),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.moveCard({targetIndex: [this.listIndex, this.cardIndex]}));
      this.store.dispatch(OrderActions.updateMovingCard({index: [this.listIndex, this.cardIndex]}));
    });
  }
  getCardContent$(cardId: string): Observable<string> {
    return this.store.pipe(
      first(),
      select(selectCardEntity(cardId)),
      filter(card => !!card),
      map(card => (card as Card).content),
    );
  }
}
