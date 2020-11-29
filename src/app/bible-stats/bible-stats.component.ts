import { Component, OnInit } from '@angular/core';
import {MemoryService} from "src/app/memory.service";
import {forkJoin} from "rxjs";
import {Router} from "@angular/router";

@Component({
  templateUrl: './bible-stats.component.html'
})
export class BibleStatsComponent implements OnInit {
  initializing: boolean = false;
  chapterCount: number = 0;
  verseCount: number = 0;
  constructor(private memoryService: MemoryService, private route: Router) { }

  ngOnInit(): void {
    let currentUser: string = this.memoryService.getCurrentUser();
    if (!currentUser) {
      // user not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    this.initializing = true;
    let maxChapObs = this.memoryService.getMaxChaptersByBook();
    let maxVerseObs = this.memoryService.getMaxVerseByBookChapter("niv");
    forkJoin([maxChapObs, maxVerseObs]).subscribe(response => {
      let maxChaptersByBook = response[0];
      this.chapterCount = maxChaptersByBook.reduce((accumulator, item) => accumulator + item.maxChapter, 0);
      let maxVerses = response[1];
      Object.keys(maxVerses).forEach(book => {
        // maxVerses is a map with entries that look like this: "genesis": [[1, 31],[2,25],[3,24]...]
        let chapterVerseCountPairs: number[][] = maxVerses[book];
        for (let chapVerse of chapterVerseCountPairs) {
          // each record should be something like: [1, 31]
          this.verseCount += chapVerse[1];
        }
      });
      this.initializing = false;
    })
  }
}
