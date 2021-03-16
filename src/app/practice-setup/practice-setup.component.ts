import { Component, OnInit } from '@angular/core';
import { PracticeSettings } from 'src/app/practice-settings';
import { Router } from '@angular/router';
import { MemoryService } from 'src/app/memory.service';
import {PassageUtils} from "src/app/passage-utils";

@Component({
  templateUrl: './practice-setup.component.html',
})
export class PracticeSetupComponent implements OnInit {
  RAND = PassageUtils.RAND;
  BY_LAST_PRACTICED = PassageUtils.BY_LAST_PRACTICED;
  BY_FREQ = PassageUtils.BY_FREQ;
  practiceSettings: PracticeSettings = new PracticeSettings();
  constructor(private route: Router, private memoryService: MemoryService) { }

  ngOnInit() {
    let currUser = this.memoryService.getCurrentUser();
    if (!currUser) {
      // user not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    setTimeout(() => {
      // make sure and clear out the current passage so that anything that relies on
      // it (e.g. top nav) will get updated
      this.memoryService.setCurrentPassage(null, currUser);
    }, 500);
    this.memoryService.getMemoryPassageCount(currUser).subscribe((count: number) => {
      if (count === 0) {
        this.route.navigate(['search']);
        return;
      }
      this.practiceSettings.practiceMode = 'by_ref';
      this.practiceSettings.displayOrder = PassageUtils.BY_FREQ;
    });
  }
}
