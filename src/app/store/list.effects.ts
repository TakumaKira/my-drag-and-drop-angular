import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, mergeMap } from 'rxjs/operators';

import { State } from '.';
import * as CardActions from './card.actions';
import * as ListActions from './list.actions';
import * as OrderActions from './order.actions';

@Injectable()
export class ListEffects {

  addList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.addList),
    map(({listId}) => OrderActions.addList({listId})),
  ));

  deleteList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.deleteList),
    mergeMap(({listId}) => this.store.pipe(
      first(),
      map(state => ({listId, cardIds: state.order.lists.filter(list => list.listId === listId)[0].cardIds})),
    )),
    mergeMap(({listId, cardIds}) => [CardActions.deleteCards({cardIds}), OrderActions.deleteList({listId})]),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<State>,
  ) {}

}
