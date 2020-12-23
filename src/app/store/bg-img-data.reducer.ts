import { Action, createReducer, on } from '@ngrx/store';
import { IUnsplashImgData } from '../types/unsplash-img-data.model';


export const bgImgDataFeatureKey = 'bgImgData';

export interface BgImgData {
  data: IUnsplashImgData | null;
  timestamp: number | null;
}

export const bgImgDataInitialState: BgImgData = {
  data: null,
  timestamp: null,
};


export const bgImgDataReducer = createReducer(
  bgImgDataInitialState,

);

