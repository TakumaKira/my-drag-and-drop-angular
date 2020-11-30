import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

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
      tap(data => this.setToLocalStorage({ data, timestamp: new Date().getTime() })),
      tap(() => this.isStoredSubject.next(true)),
    ).subscribe();
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
