import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UnsplashService } from './unsplash.service';

describe('UnsplashService', () => {
  let service: UnsplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(UnsplashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
