import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { BgImgEffects } from './bg-img.effects';
import { initialState } from '../store';

describe('BgImgEffects', () => {
  let actions$: Observable<any>;
  let store: MockStore;
  let effects: BgImgEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        BgImgEffects,
      ]
    });
    store = TestBed.inject(MockStore);
    effects = TestBed.inject(BgImgEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
