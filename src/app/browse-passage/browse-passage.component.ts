import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Passage } from 'src/app/passage';
import { PassageUtils } from 'src/app/passage-utils';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {VerseNumAndText} from "src/app/verse-num-and-text";
import {MemoryService} from "src/app/memory.service";

@Component({
  selector: 'mem-browse-passage',
  templateUrl: './browse-passage.component.html',
  animations: [
    trigger('newPassage', [
        transition('* => *', [
          style({opacity: 0.5, transform: 'scale(0.8)'}),
          animate('300ms ease-in', style({opacity: 1, transform: 'scale(1)'}))
        ])
    ])
  ]
})
export class BrowsePassageComponent implements OnInit {
  _passage: Passage = null;
  passageRef: string = null;
  formattedPassageText: string = null;
  versesForSelection: VerseNumAndText[] = [];
  passageForClipboardAsArray: VerseNumAndText[] = [];
  passageTextForClipboard: string = null;
  shortBook: boolean = true;
  isTranslCollapsed: boolean = true;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  direction: string = null;
  translationOptions: string[] = ['niv', 'nas', 'nkj', 'esv', 'kjv', 'csb', 'nlt', 'bbe', 'asv'];
  private openModal: NgbModalRef;
  private closeResult: string;
  startVerseSelected: number = -1;
  endVerseSelected: number = -1;
  interlinearURL: string;
  private matchingPassages: {nuggetId: number, bookId: number, chapter: number, startVerse: number, endVerse: number}[] = [];

  constructor(private modalService: NgbModal, public toastr: ToastrService, public memoryService: MemoryService) { }

  @Output() nextEvent: EventEmitter<string>  = new EventEmitter<string>();
  @Output() prevEvent: EventEmitter<string>  = new EventEmitter<string>();
  @Output() changeTranslationEvent: EventEmitter<string>  = new EventEmitter<string>();

  @Input() showProgressInLine: boolean = true;
  highlightNuggets: boolean = false;
  @Input() currentIndex: number = -1;
  @Input() passagesLength: number = -1;
  @Input() selectedTranslation: string;
  @Input() searching: boolean;
  @Input() searchingMessage: string;
  @Input() showHighlight: boolean = true;

  @Input() set passage(passage: Passage) {
    if (passage) {
      console.log("Setting passage...");
      this._passage = passage;
      this.matchNuggetsWithinChapter();
      this.passageRef = PassageUtils.getPassageString(this._passage, this.currentIndex, this.passagesLength, this.selectedTranslation, this.shortBook, this.showProgressInLine);
      if (this.highlightNuggets && this.matchingPassages && this.matchingPassages.length > 0) {
        this.formattedPassageText = PassageUtils.getFormattedPassageTextHighlightMatches(this._passage, true, this.matchingPassages);
      } else {
        this.formattedPassageText = PassageUtils.getFormattedPassageText(this._passage, true);
      }
      this.versesForSelection = PassageUtils.getFormattedVersesAsArray(this._passage, this.highlightNuggets ? this.matchingPassages : []);
      this.passageForClipboardAsArray = PassageUtils.getPassageForClipboardAsArray(this._passage);
      this.startVerseSelected = -1;
      this.endVerseSelected = -1;
      if (this._passage.startVerse === this._passage.endVerse) {
        this.startVerseSelected = this._passage.startVerse;
        this.endVerseSelected = this._passage.startVerse;
        this.prepareForCopyToClipboard();
      }
      let urlQuery: string;
      if (this._passage.startVerse === this._passage.endVerse) {
        urlQuery = this._passage.bookName + "+" + this._passage.chapter + ":" + this._passage.startVerse + "&t=nas"
      } else {
        urlQuery = this._passage.bookName + "+" + this._passage.chapter + ":" + this._passage.startVerse + "-" + this._passage.endVerse + "&t=nas"
      }
      this.interlinearURL = "https://www.biblestudytools.com/interlinear-bible/passage/?q=" + urlQuery;
    }
  }

  private matchNuggetsWithinChapter() {
    if (this.memoryService.nuggetIdList.length) {
      console.log("Attempting to match verses from nuggets within current passage...");
      this.matchingPassages = this.memoryService.nuggetIdList
        .filter(nug => nug.bookId === this.memoryService.getBookId(this._passage.bookName))
        .filter(nug => nug.chapter === this._passage.chapter);
      if (this.matchingPassages.length) {
        console.log("Found " + this.matchingPassages.length + " passages matching current chapter:");
        console.log(this.matchingPassages);
      } else {
        console.log("Did not find any matching passages to the current passage...");
      }
    }

  }

  ngOnInit() {
  }

  goToInterlinear() {
    window.open(this.interlinearURL, '_blank');
  }

  swipe(action) {
    if (window.screen.width > 500) { // 768px portrait
      // this is Desktop, so don't allow swipe
      console.log("Not allowing swipe");
      return;
    }
    if (action === this.SWIPE_ACTION.RIGHT) {
      // this is a hack to make sure that setter gets called in the passage navigation component
      this.direction = 'prev' + new Date();
      this.prev();
    }

    if (action === this.SWIPE_ACTION.LEFT) {
      // this is a hack to make sure that setter gets called in the passage navigation component
      this.direction = 'next' + new Date();
      this.next();
    }
  }

  prev() {
    this.prevEvent.emit('prev');
  }

  next() {
    this.nextEvent.emit('next');
  }

  selectForCopy(content) {
    this.startVerseSelected = this.versesForSelection[0].verseNum;
    this.endVerseSelected = this.versesForSelection[this.versesForSelection.length - 1].verseNum;
    this.prepareForCopyToClipboard();
    this.openModal = this.modalService.open(content);
    this.openModal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectVerseForCopy(verseNum: number, checked: boolean) {
    if (!checked) {
      // this user unchecked a checkbox
      console.log("User unselected checkbox with verse num: " + verseNum);
      if (this.startVerseSelected === verseNum && this.endVerseSelected === verseNum) {
        this.startVerseSelected = -1;
        this.endVerseSelected = -1;
      } else {
        if (this.startVerseSelected === verseNum) {
          if (this.endVerseSelected !== -1) {
            this.startVerseSelected = this.endVerseSelected;
          } else {
            this.startVerseSelected = -1;
          }
        }
        if (this.endVerseSelected === verseNum) {
          if (this.startVerseSelected !== -1) {
            this.endVerseSelected = this.startVerseSelected;
          } else {
            this.endVerseSelected = -1;
          }
        }
      }
    } else {
      // if no verses are selected yet, set both start and end verse to the selected verse index number
      if (this.startVerseSelected === -1 && this.endVerseSelected === -1) {
        this.startVerseSelected = verseNum;
        this.endVerseSelected = verseNum;
      } else {
        // this means at least 1 verse is selected, so...
        // if the start verse is not selected
        if (this.startVerseSelected === -1) {
          this.startVerseSelected = verseNum;
          if (this.endVerseSelected < this.startVerseSelected) {
            this.endVerseSelected = this.startVerseSelected;
          }
        } else {
          // this means, the start verse is already selected
          if (verseNum >= this.startVerseSelected) {
            // so, if the verse selected this time is greater than the start verse
            // which was previously selected, then the currently selected verse can
            // be safely set as the end verse
            this.endVerseSelected = verseNum;
          } else {
            // this means that the currently selected verse is less than the previously
            // selected start verse, so set the end verse to the previously selected start verse
            // then set the start verse to the newly selected verse
            this.endVerseSelected = this.startVerseSelected;
            this.startVerseSelected = verseNum;
          }
        }
      }
    }
    this.prepareForCopyToClipboard();
  }

  private prepareForCopyToClipboard() {
    console.log("selectVerseForCopy - startVerse: " + this.startVerseSelected + ", endVerse: " + this.endVerseSelected);
    if (this.startVerseSelected === -1 || this.endVerseSelected === -1) {
      console.log("Can't copy verses: selectVerseForCopy - startVerse: " + this.startVerseSelected + ", endVerse: " + this.endVerseSelected);
      return;
    }
    let selectedPassage = PassageUtils.deepClonePassage(this._passage);
    selectedPassage.startVerse = this.startVerseSelected;
    selectedPassage.endVerse = this.endVerseSelected;
    let psgRefForClipboard: string = PassageUtils.getPassageStringNoIndex(selectedPassage, null, false);
    psgRefForClipboard += "\n\n";
    let psgForClipboard: string = "";
    for (let verse of this.passageForClipboardAsArray) {
      if (verse.verseNum >= this.startVerseSelected && verse.verseNum <= this.endVerseSelected) {
        psgForClipboard += verse.verseText;
      }
    }
    psgForClipboard = psgForClipboard.trim();
    this.passageTextForClipboard = psgRefForClipboard + psgForClipboard;
  }

  getVerseDisplayForCheckbox(verse: VerseNumAndText): string {
    return verse.verseNum + " " + verse.verseText;
  }

  clipboardCopyComplete() {
    this.toastr.info('The passage has been copied to the clipboard!', 'Success!');
    if (this.openModal) {
      this.openModal.close();
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  toggleTranslationOptions() {
    this.isTranslCollapsed = !this.isTranslCollapsed;
  }

  selectTranslation(translation: string): boolean {
    this.selectedTranslation = translation;
    this.isTranslCollapsed = true;
    this.changeTranslationEvent.emit(this.selectedTranslation);
    return false;
  }

  logIt(event: any, mode: string) {
    console.log('Here is the mode: ' + mode + '.  Here is the event: ');
    console.log(event);
  }

  updateHighlight(checked: boolean) {
    this.highlightNuggets = checked;
    if (this.highlightNuggets && this.matchingPassages && this.matchingPassages.length > 0) {
      this.formattedPassageText = PassageUtils.getFormattedPassageTextHighlightMatches(this._passage, true, this.matchingPassages);
    } else {
      this.formattedPassageText = PassageUtils.getFormattedPassageText(this._passage, true);
    }
    this.versesForSelection = PassageUtils.getFormattedVersesAsArray(this._passage, this.highlightNuggets ? this.matchingPassages : []);
  }
}
