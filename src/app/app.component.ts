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
  lists: any[] = [{ title: 'A', cards: ['aa', 'ab', 'ac'] }, { title: 'B', cards: ['ba', 'bb'] }, { title: 'C', cards: ['ca'] }];
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
  updateListTitle(e: Event, i: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      elem.textContent = this.lists[i].title;
      return;
    }
    this.lists[i].title = textContent;
  }
  updateCard(e: Event, i: number, j: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      elem.textContent = this.lists[i].cards[j];
      return;
    }
    this.lists[i].cards[j] = textContent;
  }
}
