import { Component, HostListener, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';

import { IdService } from 'src/app/services/id.service';
import { State } from 'src/app/store';
import * as CardActions from 'src/app/store/card.actions';
import * as ListActions from 'src/app/store/list.actions';
import { List } from 'src/app/store/list.model';
import { selectListEntity } from 'src/app/store/list.selectors';
import * as OrderActions from 'src/app/store/order.actions';
import { OrderList } from 'src/app/store/order.reducer';
import { selectOrderLists, selectOrderState } from 'src/app/store/order.selectors';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() listIndex!: number;
  @Input() list!: OrderList;

  orderList$: Observable<OrderList[]>;

  constructor(
    private store: Store<State>,
    private id: IdService,
  ) {
    this.orderList$ = this.store.pipe(
      select(selectOrderLists),
      distinctUntilChanged(isEqual),
    );
  }

  onDragStartList(e: DragEvent): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard === null),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.updateMovingList({index: this.listIndex}));
      ((e.target as HTMLElement).querySelector('.list-title') as HTMLElement).blur();
    });
  }
  @HostListener('dragenter')
  onDragEnterList(): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard !== null),
      filter(order => order.lists[this.listIndex].cardIds.length === 0),
    ).subscribe(() => this.onDragEnterCard(this.listIndex, 0));
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingCard === null),
      filter(order => order.draggingList !== null),
      filter(order => order.draggingList !== this.listIndex),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.moveList({targetIndex: this.listIndex}));
      this.store.dispatch(OrderActions.updateMovingList({index: this.listIndex}));
    });
  }
  private onDragEnterCard(i: number, j: number): void {
    this.store.pipe(
      first(),
      select(selectOrderState),
      filter(order => order.draggingList === null),
      filter(order => order.draggingCard !== null),
      filter(order => (order.draggingCard as [number, number])[0] !== i || (order.draggingCard as [number, number])[1] !== j),
    ).subscribe(() => {
      this.store.dispatch(OrderActions.moveCard({targetIndex: [i, j]}));
      this.store.dispatch(OrderActions.updateMovingCard({index: [i, j]}));
    });
  }
  updateListTitle(e: Event): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.orderList$.pipe(first()).subscribe(lists =>
          this.store.dispatch(ListActions.deleteList({listId: lists[this.listIndex].listId})));
      } else {
        this.store.pipe(first()).subscribe(state =>
          elem.textContent = state.lists.entities[state.order.lists[this.listIndex].listId]?.title as string);
      }
      return;
    }
    this.orderList$.pipe(first()).subscribe(lists =>
      this.store.dispatch(ListActions.updateListTitle({ listId: lists[this.listIndex].listId, title: textContent })));
  }
  addCard(): void {
    this.orderList$.pipe(first()).subscribe(lists =>
      this.store.dispatch(CardActions.addCard({ cardId: this.id.get(), listId: lists[this.listIndex].listId })));
  }
  getListTitle$(listId: string): Observable<string> {
    return this.store.pipe(
      first(),
      select(selectListEntity(listId)),
      filter(list => !!list),
      map(list => (list as List).title),
    );
  }
}
