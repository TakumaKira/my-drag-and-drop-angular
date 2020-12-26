import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { UnsplashService } from './services/unsplash.service';
import { State } from './store';
import * as BgImgActions from './store/bg-img.actions';
import { selectBgImgData } from './store/bg-img.selectors';
import * as CardActions from './store/card.actions';
import { Card } from './store/card.model';
import { selectCardEntity } from './store/card.selectors';
import * as ListActions from './store/list.actions';
import { List } from './store/list.model';
import { selectListEntity } from './store/list.selectors';
import * as OrderActions from './store/order.actions';
import { OrderList } from './store/order.reducer';
import { selectOrderLists } from './store/order.selectors';
import { IUnsplashImgData } from './types/unsplash-img-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundImage') backgroundImage = '';
  bgImgData: IUnsplashImgData | null = null;
  draggingList: number | null = null;
  draggingCard: [number, number] | null = null;
  orderList$: Observable<OrderList[]>;
  constructor(
    public unsplash: UnsplashService,
    private store: Store<State>,
  ) {
    this.orderList$ = this.store.pipe(
      select(selectOrderLists),
      distinctUntilChanged(isEqual),
    );
  }
  ngOnInit(): void {
    this.store.pipe(
      select(selectBgImgData),
      filter(bgImgData => !!bgImgData),
      first(),
    ).subscribe(bgImgData => {
      this.bgImgData = bgImgData;
      this.backgroundImage = `url("${this.bgImgData?.urls.full}")`;
    });
    this.store.dispatch(BgImgActions.checkLocalStorage());
  }
  addList(): void {
    this.store.dispatch(ListActions.addList({ listId: uuidv4() }));
  }
  updateListTitle(e: Event, i: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.store.pipe(first(), select(selectOrderLists)).subscribe(lists =>
          this.store.dispatch(ListActions.deleteList({listId: lists[i].listId})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.lists.entities[state.order.lists[i].listId]?.title as string);
      }
      return;
    }
    this.store.pipe(first(), select(selectOrderLists)).subscribe(lists =>
      this.store.dispatch(ListActions.updateListTitle({ listId: lists[i].listId, title: textContent })));
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
    this.store.pipe(first(), select(selectOrderLists)).subscribe(lists =>
      this.store.dispatch(CardActions.addCard({ cardId: uuidv4(), listId: lists[listIndex].listId })));
  }
  updateCard(e: Event, i: number, j: number): void {
    if (this.draggingCard) { return; } // Prevent executing this when starting dragging a card(thus dragged card content remains)
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this card?')) {
        this.store.pipe(first(), select(selectOrderLists)).subscribe(lists =>
          this.store.dispatch(CardActions.deleteCard({listId: lists[i].listId, cardId: lists[i].cardIds[j]})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.cards.entities[state.order.lists[i].cardIds[j]]?.content as string);
      }
      return;
    }
    this.store.pipe(first(), select(selectOrderLists)).subscribe(lists =>
      this.store.dispatch(CardActions.updateCard({ cardId: lists[i].cardIds[j], contents: textContent })));
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
      select(selectListEntity(listId)),
      filter(list => !!list),
      map(list => (list as List).title),
    );
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
