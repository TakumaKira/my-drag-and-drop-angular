import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { BgImgData, bgImgDataFeatureKey, bgImgDataInitialState, bgImgDataReducer } from './bg-img-data.reducer';
import { Cards, cardsFeatureKey, cardsInitialState, cardsReducer } from './card.reducer';
import { Lists, listsFeatureKey, listsInitialState, listsReducer } from './list.reducer';
import { Order, orderFeatureKey, orderInitialState, orderReducer } from './order.reducer';

export interface State {
  [bgImgDataFeatureKey]: BgImgData;
  [listsFeatureKey]: Lists;
  [cardsFeatureKey]: Cards;
  [orderFeatureKey]: Order;
}

export const initialState: State = {
  bgImgData: bgImgDataInitialState,
  lists: listsInitialState,
  cards: cardsInitialState,
  order: orderInitialState,
};

export const reducers: ActionReducerMap<State> = {
  [bgImgDataFeatureKey]: bgImgDataReducer,
  [listsFeatureKey]: listsReducer,
  [cardsFeatureKey]: cardsReducer,
  [orderFeatureKey]: orderReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
