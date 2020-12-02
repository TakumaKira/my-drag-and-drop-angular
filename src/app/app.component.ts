import { Component, HostBinding, OnInit } from '@angular/core';
import { UnsplashService } from './services/unsplash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundImage') backgroundImage = '';
  bgImgData: any;
  lists: any[] = [{ title: 'a', cards: ['aa', 'ab', 'ac'] }, { title: 'b', cards: ['ba', 'bb'] }, { title: 'c', cards: ['ca'] }];
  constructor(
    public unsplash: UnsplashService,
  ) {}
  ngOnInit(): void {
    this.unsplash.getBgImgData().subscribe(bgImgData => {
      this.bgImgData = bgImgData;
      this.backgroundImage = `url("${this.bgImgData.urls.full}")`;
    });
  }
  addList(): void {
    this.lists.push({ title: 'New List', cards: [] });
  }
  addCard(listIndex: number): void {
    this.lists[listIndex].cards.push('New Card');
  }
}
