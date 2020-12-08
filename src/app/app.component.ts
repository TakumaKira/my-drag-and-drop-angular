import { Component, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';
import { UnsplashService } from './services/unsplash.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundImage') backgroundImage = '';
  bgImgData: any;
  lists: IList[] = [
    { title: 'A', cards: ['aa', 'ab', 'ac', 'ad', 'ae'] },
    { title: 'B', cards: ['ba'] },
    { title: 'C', cards: ['ca'] },
    { title: 'D', cards: ['da'] },
    { title: 'E', cards: ['ea'] },
  ];
  listsBeforeMoved: IList[] | null = null;
  draggingList: number | null = null;
  draggingCard: number[] | null = null;
  constructor(
    public unsplash: UnsplashService,
    private el: ElementRef<HTMLElement>,
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
  updateListTitle(e: Event, i: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.lists.splice(i, 1);
      } else {
        elem.textContent = this.lists[i].title;
      }
      return;
    }
    this.lists[i].title = textContent;
  }
  onDragStartList(i: number): void {
    if (this.draggingCard) { return; }
    this.draggingList = i;
    this.listsBeforeMoved = cloneDeep(this.lists);
  }
  onDragEnterList(i: number): void {
    if (this.draggingCard && this.lists[i].cards.length === 0) {
      this.onDragEnterCard(i, 0);
    }
    if (this.draggingCard) { return; }
    this.lists = cloneDeep(this.listsBeforeMoved) as IList[];
    const moved = this.lists.splice((this.draggingList as number), 1)[0];
    this.lists.splice(i, 0, moved);
  }
  addCard(listIndex: number): void {
    this.lists[listIndex].cards.push('New Card');
  }
  updateCard(e: Event, i: number, j: number): void {
    const elem = e.target as HTMLElement;
    const { textContent } = elem;
    if (!textContent) {
      if (confirm('Are you sure you want to delete this card?')) {
        this.lists[i].cards.splice(j, 1);
      } else {
        elem.textContent = this.lists[i].cards[j];
      }
      return;
    }
    this.lists[i].cards[j] = textContent;
  }
  onDragStartCard(i: number, j: number): void {
    this.draggingCard = [i, j];
    this.listsBeforeMoved = cloneDeep(this.lists);
  }
  onDragEnterCard(i: number, j: number): void {
    this.lists = cloneDeep(this.listsBeforeMoved) as IList[];
    const moved = this.lists[(this.draggingCard as number[])[0]].cards.splice((this.draggingCard as number[])[1], 1)[0];
    this.lists[i].cards.splice(j, 0, moved);
  }
  @HostListener('dragover', ['$event'])
  onDragOverList(e: DragEvent): void {
    e.preventDefault(); // Need to enable drop event and to disable "element back" animation
  }
  @HostListener('dragend')
  onDragEndList(): void {
    this.draggingList = null;
    this.draggingCard = null;
    this.listsBeforeMoved = null;
  }
  trackByItems(index: number, item: IList): number {
    return index;
  }
}

interface IList {
  title: string;
  cards: string[];
}
