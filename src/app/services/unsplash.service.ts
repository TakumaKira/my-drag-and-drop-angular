import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, first, map, tap } from 'rxjs/operators';
import { FALLBACK_BG_IMG_DATA } from '../constants/fallback-bg-img';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  myAppName = 'my_drag_and_drop';
  unsplashUrl = 'https://unsplash.com/';
  query = `?utm_source=${this.myAppName}&utm_medium=referral`;
  private readonly unsplashApiUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
  private readonly lifetime = 72000; // allow 50 times in an hour => 60 * 60 * 1000 / 50
  private isStoredSubject = new BehaviorSubject<boolean>(false);
  private readonly LOCAL_STORAGE_STORE_KEY = 'bgImg';
  constructor(
    private http: HttpClient,
  ) {
    if (this.isStored()) {
      this.isStoredSubject.next(true);
    } else {
      this.fetch();
    }
  }
  private isStored(): boolean {
    const bgImg = this.getFromLocalStorage();
    return !!bgImg && !this.isExpired(bgImg.timestamp);
  }
  private isExpired(timestamp: number): boolean {
    return new Date().getTime() - timestamp > this.lifetime;
  }
  private fetch(): void {
    this.http.get(this.unsplashApiUrl).pipe(
      catchError(error => this.handleError(error)),
      tap(data => console.log(data)),
      tap(data => this.setToLocalStorage({ data, timestamp: new Date().getTime() })),
      tap(() => this.isStoredSubject.next(true)),
    ).subscribe();
  }
  private handleError(error: HttpErrorResponse): any {
    // client error or network error
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    // server error
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // set fallback image data
    console.warn('Using fallback image data...');
    this.setToLocalStorage({ data: FALLBACK_BG_IMG_DATA, timestamp: new Date().getTime() });
    this.isStoredSubject.next(true);
    // return error message
    return throwError('Something bad happened; please try again later.');
  }
  getBgImgData(): Observable<any> {
    return this.isStoredSubject.asObservable().pipe(
      filter(isStored => isStored),
      first(),
      map(() => this.getFromLocalStorage()?.data),
    );
  }

  private getFromLocalStorage(): IStoredBgImgData | null {
    const bgImgStr = localStorage.getItem(this.LOCAL_STORAGE_STORE_KEY);
    return !!bgImgStr ? JSON.parse(bgImgStr) as IStoredBgImgData : null;
  }
  private setToLocalStorage(data: IStoredBgImgData): void {
    localStorage.setItem(this.LOCAL_STORAGE_STORE_KEY, JSON.stringify(data));
  }
}

interface IStoredBgImgData {
  data: any;
  timestamp: number;
}
