import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CardEffects } from './card.effects';

describe('CardEffects', () => {
  let actions$: Observable<any>;
  let effects: CardEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CardEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CardEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
