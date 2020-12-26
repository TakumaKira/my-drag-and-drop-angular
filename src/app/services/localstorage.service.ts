import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private readonly LOCAL_STORAGE_STORE_KEY = 'state';

  set(data: any): void {
    localStorage.setItem(this.LOCAL_STORAGE_STORE_KEY, JSON.stringify(data));
  }

  get(): any | undefined {
    const dataStr = localStorage.getItem(this.LOCAL_STORAGE_STORE_KEY);
    if (!dataStr) { return undefined; }
    return JSON.parse(dataStr);
  }
}
