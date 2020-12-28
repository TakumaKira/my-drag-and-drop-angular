import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';

import { IdService } from './services/id.service';
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
import { selectOrderLists, selectOrderState } from './store/order.selectors';
import { IUnsplashImgData } from './types/unsplash-img-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundImage') backgroundImage = '';
  bgImgData: IUnsplashImgData | null = null;
  orderList$: Observable<OrderList[]>;
  constructor(
    public unsplash: UnsplashService,
    private store: Store<State>,
    private id: IdService,
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
    this.store.dispatch(BgImgActions.getData());
  }
  addList(): void {
    this.store.dispatch(ListActions.addList({ listId: this.id.get() }));
  }
  updateListTitle(e: Event, i: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.orderList$.pipe(first()).subscribe(lists =>
          this.store.dispatch(ListActions.deleteList({listId: lists[i].listId})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.lists.entities[state.order.lists[i].listId]?.title as string);
      }
      return;
    }
    this.orderList$.pipe(first()).subscribe(lists =>
      this.store.dispatch(ListActions.updateListTitle({ listId: lists[i].listId, title: textContent })));
  }
  onDragStartList(i: number, e: DragEvent): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard === null),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.updateMovingList({index: i}));
      ((e.target as HTMLElement).querySelector('.list-title') as HTMLElement).blur();
    });
  }
  onDragEnterList(i: number): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard !== null),
      filter(order => order.lists[i].cardIds.length === 0),
    ).subscribe(() => this.onDragEnterCard(i, 0));
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard === null),
      filter(order => order.draggingList !== null),
      filter(order => order.draggingList !== i),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.moveList({index: i}));
      this.store.dispatch(OrderActions.updateMovingList({index: i}));
    });
  }
  addCard(listIndex: number): void {
    this.orderList$.pipe(first()).subscribe(lists =>
      this.store.dispatch(CardActions.addCard({ cardId: this.id.get(), listId: lists[listIndex].listId })));
  }
  updateCard(e: Event, i: number, j: number): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      // tslint:disable-next-line:max-line-length
      filter(order => order.draggingCard === null), // Prevent executing this when starting dragging a card(thus dragged card content remains)
    ).subscribe(() => {
      const elem = e.target as HTMLElement;
      const { textContent } = elem;
      if (!textContent) {
        if (confirm('Are you sure you want to delete this card?')) {
          this.orderList$.pipe(first()).subscribe(lists =>
            this.store.dispatch(CardActions.deleteCard({listId: lists[i].listId, cardId: lists[i].cardIds[j]})));
        } else {
          this.store.pipe(first()).subscribe(state =>
            elem.textContent = state.cards.entities[state.order.lists[i].cardIds[j]]?.content as string);
        }
        return;
      }
      this.orderList$.pipe(first()).subscribe(lists =>
        this.store.dispatch(CardActions.updateCard({ cardId: lists[i].cardIds[j], contents: textContent })));
    });
  }
  onDragStartCard(i: number, j: number, e: DragEvent): void {
    this.store.dispatch(OrderActions.updateMovingCard({index: [i, j]}));
    (e.target as HTMLElement).blur();
  }
  onDragEnterCard(i: number, j: number): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingList === null),
      filter(order => order.draggingCard !== null),
      filter(order => (order.draggingCard as [number, number])[0] !== i || (order.draggingCard as [number, number])[1] !== j),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.moveCard({index: [i, j]}));
      this.store.dispatch(OrderActions.updateMovingCard({index: [i, j]}));
    });
  }
  @HostListener('dragover', ['$event'])
  onDragOverList(e: DragEvent): void {
    e.preventDefault(); // Need to enable drop event and to disable "element back" animation
  }
  @HostListener('dragend')
  onDragEndList(): void {
    this.store.dispatch(OrderActions.finishMoving());
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
