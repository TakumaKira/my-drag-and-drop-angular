import { Action, createReducer, on } from '@ngrx/store';


export const bgImgDataFeatureKey = 'bgImgData';

export interface BgImgData {

}

const initialState: BgImgData = {

};


export const bgImgDataReducer = createReducer(
  initialState,

);

