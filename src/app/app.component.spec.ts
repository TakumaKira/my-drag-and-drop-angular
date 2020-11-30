import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { UnsplashService } from './services/unsplash.service';

describe('AppComponent', () => {
  let mockUnsplashService;
  beforeEach(async () => {
    mockUnsplashService = jasmine.createSpyObj(['getBgImgData']);
    mockUnsplashService.getBgImgData.and.returnValue(of(null));
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [ { provide: UnsplashService, useValue: mockUnsplashService } ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
