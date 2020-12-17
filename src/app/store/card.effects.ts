import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as CardActions from './card.actions';
import * as OrderActions from './order.actions';

@Injectable()
export class CardEffects {

  addCard$ = createEffect(() => this.actions$.pipe(
    ofType(CardActions.addCard),
    map(({listId, cardId}) => OrderActions.addCard({listId, cardId})),
  ));

  deleteCard$ = createEffect(() => this.actions$.pipe(
    ofType(CardActions.deleteCard),
    map(({listId, cardId}) => OrderActions.deleteCard({listId, cardId})),
  ));

  constructor(private actions$: Actions) {}

}
