import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { ListEffects } from './list.effects';
import { initialState } from '.';

describe('ListEffects', () => {
  let actions$: Observable<any>;
  let effects: ListEffects;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListEffects,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ]
    });
    store = TestBed.inject(MockStore);
    effects = TestBed.inject(ListEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
