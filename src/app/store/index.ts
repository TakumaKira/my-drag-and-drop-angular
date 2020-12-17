import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { BgImgData, bgImgDataFeatureKey, bgImgDataReducer } from './bg-img-data.reducer';
import { Cards, cardsFeatureKey, cardsReducer } from './card.reducer';
import { Lists, listsFeatureKey, listsReducer } from './list.reducer';
import { Order, orderFeatureKey, orderReducer } from './order.reducer';

export interface State {
  [bgImgDataFeatureKey]: BgImgData;
  [listsFeatureKey]: Lists;
  [cardsFeatureKey]: Cards;
  [orderFeatureKey]: Order;
}

export const initialState: State = {
  bgImgData: {},
  lists: { ids: [], entities: {} },
  cards: { ids: [], entities: {} },
  order: { lists: [] },
};

export const reducers: ActionReducerMap<State> = {
  [bgImgDataFeatureKey]: bgImgDataReducer,
  [listsFeatureKey]: listsReducer,
  [cardsFeatureKey]: cardsReducer,
  [orderFeatureKey]: orderReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
