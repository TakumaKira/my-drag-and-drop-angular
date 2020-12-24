import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BgImgDataEffects } from './bg-img-data.effects';

describe('BgImgDataEffects', () => {
  let actions$: Observable<any>;
  let effects: BgImgDataEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BgImgDataEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BgImgDataEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
