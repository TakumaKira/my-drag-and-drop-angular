import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BgImgEffects } from './bg-img.effects';

describe('BgImgEffects', () => {
  let actions$: Observable<any>;
  let effects: BgImgEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BgImgEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BgImgEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
