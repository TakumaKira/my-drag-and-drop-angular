import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { UnsplashService } from './services/unsplash.service';
import { initialState } from './store';

describe('AppComponent', () => {
  let mockUnsplashService;
  let store: MockStore;

  beforeEach(async () => {
    mockUnsplashService = jasmine.createSpyObj(['getBgImgData']);
    mockUnsplashService.getBgImgData.and.returnValue(of(null));
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: UnsplashService, useValue: mockUnsplashService },
        provideMockStore({ initialState }),
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
