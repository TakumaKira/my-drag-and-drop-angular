import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash/isEqual';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first } from 'rxjs/operators';

import { IdService } from './services/id.service';
import { UnsplashService } from './services/unsplash.service';
import { State } from './store';
import * as BgImgActions from './store/bg-img.actions';
import { selectBgImgData } from './store/bg-img.selectors';
import * as ListActions from './store/list.actions';
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
  addList(): void {
    this.store.dispatch(ListActions.addList({ listId: this.id.get() }));
  }
}
