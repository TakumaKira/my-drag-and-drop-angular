import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private bgImgData: object = {};
  constructor(
    private http: HttpClient,
  ) {}
  ngOnInit(): void {
    this.getBgImgData();
  }
  private getBgImgData(): void {
    const bgImgDataStr = localStorage.getItem('bgImgData');
    if (bgImgDataStr) {
      this.bgImgData = JSON.parse(bgImgDataStr);
    } else {
      const unsplashApiUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
      this.http.get(unsplashApiUrl).pipe(
        tap(res => localStorage.setItem('bgImgData', JSON.stringify(res))),
        tap(res => this.bgImgData = res),
      ).subscribe();
    }
  }
}
