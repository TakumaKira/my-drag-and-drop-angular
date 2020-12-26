import {
  Action,
  ActionReducer,
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';

import { environment } from '../../environments/environment';
import { LocalstorageService } from '../services/localstorage.service';
import { BgImg, bgImgFeatureKey, bgImgInitialState, bgImgReducer } from './bg-img.reducer';
import { Cards, cardsFeatureKey, cardsInitialState, cardsReducer } from './card.reducer';
import { Lists, listsFeatureKey, listsInitialState, listsReducer } from './list.reducer';
import { Order, orderFeatureKey, orderInitialState, orderReducer } from './order.reducer';

export interface State {
  [bgImgFeatureKey]: BgImg;
  [listsFeatureKey]: Lists;
  [cardsFeatureKey]: Cards;
  [orderFeatureKey]: Order;
}

export const initialState: State = {
  [bgImgFeatureKey]: bgImgInitialState,
  [listsFeatureKey]: listsInitialState,
  [cardsFeatureKey]: cardsInitialState,
  [orderFeatureKey]: orderInitialState,
};

export const reducers: ActionReducerMap<State> = {
  [bgImgFeatureKey]: bgImgReducer,
  [listsFeatureKey]: listsReducer,
  [cardsFeatureKey]: cardsReducer,
  [orderFeatureKey]: orderReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const storeLocalstorage = (localstorageService: LocalstorageService): MetaReducer<State> => {
  return (reducer: ActionReducer<State, Action>): ActionReducer<State, Action> => {
    return (state, action) => {
      if (action.type === '@ngrx/store/init') {
        state = localstorageService.get();
      }
      const nextState = reducer(state, action);
      localstorageService.set(nextState);
      return nextState;
    };
  };
};

export const getMetaReducers = (localstorageService: LocalstorageService): MetaReducer<State>[] => {
  return [...metaReducers, storeLocalstorage(localstorageService)];
};
