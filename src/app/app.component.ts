import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { UnsplashService } from './services/unsplash.service';
import { State } from './store';
import * as CardActions from './store/card.actions';
import { Card } from './store/card.model';
import * as ListActions from './store/list.actions';
import { List } from './store/list.model';
import * as OrderActions from './store/order.actions';
import { OrderList } from './store/order.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundImage') backgroundImage = '';
  bgImgData: any;
  draggingList: number | null = null;
  draggingCard: [number, number] | null = null;
  orderList$: Observable<OrderList[]>;
  constructor(
    public unsplash: UnsplashService,
    private store: Store<State>,
  ) {
    this.orderList$ = this.store.pipe(
      map(state => state.order.lists),
      distinctUntilChanged(isEqual),
    );
  }
  ngOnInit(): void {
    this.unsplash.getBgImgData().subscribe(bgImgData => {
      this.bgImgData = bgImgData;
      this.backgroundImage = `url("${this.bgImgData.urls.full}")`;
    });
  }
  addList(): void {
    this.store.dispatch(ListActions.addList({ listId: uuidv4() }));
  }
  updateListTitle(e: Event, i: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.store.pipe(first()).subscribe(state =>
          this.store.dispatch(ListActions.deleteList({listId: state.order.lists[i].listId})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.lists.entities[state.order.lists[i].listId]?.title as string);
      }
      return;
    }
    this.store.pipe(first()).subscribe(state =>
      this.store.dispatch(ListActions.updateListTitle({ listId: state.order.lists[i].listId, title: textContent })));
  }
  onDragStartList(i: number, e: DragEvent): void {
    if (this.draggingCard) { return; }
    this.draggingList = i;
    ((e.target as HTMLElement).querySelector('.list-title') as HTMLElement).blur();
  }
  onDragEnterList(i: number): void {
    this.orderList$.pipe(
      first(),
      filter(() => !!this.draggingCard),
      filter(orderList => orderList[i].cardIds.length === 0),
    ).subscribe(() => this.onDragEnterCard(i, 0));
    if (this.draggingList === null) { return; }
    if (this.draggingCard) { return; }
    if (this.draggingList === i) { return; }
    this.store.dispatch(OrderActions.moveList({from: (this.draggingList as number), to: i}));
    this.draggingList = i;
  }
  addCard(listIndex: number): void {
    this.store.pipe(first()).subscribe(state =>
      this.store.dispatch(CardActions.addCard({ cardId: uuidv4(), listId: state.order.lists[listIndex].listId })));
  }
  updateCard(e: Event, i: number, j: number): void {
    if (this.draggingCard) { return; } // Prevent executing this when starting dragging a card(thus dragged card content remains)
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this card?')) {
        this.store.pipe(first()).subscribe(state =>
          this.store.dispatch(CardActions.deleteCard({listId: state.order.lists[i].listId, cardId: state.order.lists[i].cardIds[j]})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.cards.entities[state.order.lists[i].cardIds[j]]?.content as string);
      }
      return;
    }
    this.store.pipe(first()).subscribe(state =>
      this.store.dispatch(CardActions.updateCard({ cardId: state.order.lists[i].cardIds[j], contents: textContent })));
  }
  onDragStartCard(i: number, j: number, e: DragEvent): void {
    this.draggingCard = [i, j];
    (e.target as HTMLElement).blur();
  }
  onDragEnterCard(i: number, j: number): void {
    if (this.draggingList) { return; }
    if (this.draggingCard === null) { return; }
    if ((this.draggingCard as [number, number])[0] === i && (this.draggingCard as [number, number])[1] === j) { return; }
    this.store.dispatch(OrderActions.moveCard({from: (this.draggingCard as [number, number]), to: [i, j]}));
    this.draggingCard = [i, j];
  }
  @HostListener('dragover', ['$event'])
  onDragOverList(e: DragEvent): void {
    e.preventDefault(); // Need to enable drop event and to disable "element back" animation
  }
  @HostListener('dragend')
  onDragEndList(): void {
    this.draggingList = null;
    this.draggingCard = null;
  }
  trackByItems(index: number, item: OrderList): number {
    return index;
  }
  getListTitle$(listId: string): Observable<string> {
    return this.store.pipe(
      first(),
      map(store => store.lists.entities[listId]),
      filter(list => !!list),
      map(list => (list as List).title),
    );
  }
  getCardContent$(cardId: string): Observable<string> {
    return this.store.pipe(
      first(),
      map(store => store.cards.entities[cardId]),
      filter(card => !!card),
      map(card => (card as Card).content),
    );
  }
}
