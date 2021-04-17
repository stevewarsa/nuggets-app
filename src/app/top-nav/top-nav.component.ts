import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemoryService} from 'src/app/memory.service';
import {ToastrService} from 'ngx-toastr';
import {Passage} from 'src/app/passage';
import {PassageUtils} from 'src/app/passage-utils';
import {Router} from '@angular/router';
import {CookieUtils} from 'src/app/cookie-utils';
import {ModalHelperService} from "src/app/modal-helper.service";
import {environment} from "src/environments/environment";

@Component({
  selector: 'mem-top-nav',
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent implements OnInit, OnDestroy {
  expanded = false;
  isCollapsed = true;
  passageTextForClipboard: string;
  currentUser: string;
  mobile: boolean = false;
  currentPassage: Passage;
  passageSubscription: any;

  constructor(public memoryService: MemoryService, public toastr: ToastrService, private router: Router, private modalHelper: ModalHelperService) { }

  ngOnInit() {
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }
    this.currentUser = this.memoryService.getCurrentUser();
    this.currentPassage = this.memoryService.getCurrentPassage();
    this.passageTextForClipboard = this.getCurrentPassageText();
    this.passageSubscription = this.memoryService.currentPassageChangeEvent.subscribe((passage: Passage) => {
      this.currentPassage = this.memoryService.getCurrentPassage();
    });
    if (this.memoryService.nuggetIdList.length === 0) {
      this.memoryService.getNuggetIdList().subscribe((nuggetIds: any[]) => {
        this.memoryService.nuggetIdList = nuggetIds;
      });
    }
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves.
    if (this.passageSubscription) {
       this.passageSubscription.unsubscribe();
    }
  }

  clipboardCopyComplete() {
    this.toastr.info('The passage has been copied to the clipboard!', 'Success!');
  }

  private getCurrentPassageText(): string {
    let currentPassage: Passage = this.memoryService.getCurrentPassage();
    if (currentPassage === null) {
      return null;
    }
    let passageTextForClipboard: string = PassageUtils.getPassageForClipboard(currentPassage);
    return passageTextForClipboard;
  }

  doLogout() {
    this.toggleExpanded();
    this.memoryService.setCurrentUser(null);
    CookieUtils.deleteCookie('user.name');
    this.router.navigate(['']);
  }

  toggleExpanded(): boolean {
    let currentPassage: Passage = this.memoryService.getCurrentPassage();
    if (currentPassage && currentPassage !== null && this.memoryService.getCurrentUser()) {
      this.passageTextForClipboard = this.getCurrentPassageText();
      if (this.passageTextForClipboard === "") {
        this.memoryService.getUpdatedCurrentPassageText().subscribe((passage: Passage) => {
          currentPassage.verses = passage.verses;
          this.memoryService.setCurrentPassage(currentPassage, this.memoryService.getCurrentUser());
          this.passageTextForClipboard = this.getCurrentPassageText();
        });
      }
    }
    this.isCollapsed = !this.isCollapsed;
    return false;
  }

  showAbout() {
    this.modalHelper.alert({message: 'Date Built: ' + environment.dateBuilt}).result.then(() => {});
  }
}
