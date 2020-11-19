import {Component, OnInit, Injector, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { MemoryService } from 'src/app/memory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PassageUtils } from 'src/app/passage-utils';
import { trigger, style, animate, transition } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MemUser } from 'src/app/mem-user';
import { ModalHelperService } from 'src/app/modal-helper.service';
import { StringUtils } from 'src/app/string.utils';
import {Quote} from "src/app/quote";

@Component({
  styleUrls: ['./browse-quotes.component.css'],
  templateUrl: './browse-quotes.component.html',
  animations: [
    trigger('newQuote', [
      transition('* => *', [
        style({opacity: 0.5, transform: 'scale(0.8)'}),
        animate('300ms ease-in', style({opacity: 1, transform: 'scale(1)'}))
      ])
    ])
  ]
})
export class BrowseQuotesComponent implements OnInit, AfterViewInit {
  searching: boolean = false;
  searchingMessage: string = null;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  direction: string = null;
  allQuotes: Quote[] = [];
  currentIndex: number = 0;
  currentQuote: string = "";
  currentQuoteForClipboard: string = "";
  currentQuoteUpdatedText: string = null;
  isCollapsed: boolean = true;
  private openModal: NgbModalRef;
  private closeResult: string;
  users: MemUser[] = [];
  mappings: any[] = [];
  startingId: number = 0;
  currUser: string = null;
  editingQuote: boolean = false;
  rowCount: number;
  colCount: number;

  @ViewChild("editTextElem") private editTextElem: ElementRef;

  constructor(
    public memoryService: MemoryService,
    private route: Router,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private modalHelperService: ModalHelperService,
    private activeRoute:ActivatedRoute,
    private injector: Injector) { }

  ngOnInit() {
    this.currUser = this.memoryService.getCurrentUser();
    if (!this.currUser) {
      // user not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    if (this.memoryService.searchQuotesResult) {
      let quotes = BrowseQuotesComponent.filterOutNonApprovedQuotes(this.memoryService.searchQuotesResult);
      PassageUtils.shuffleArray(quotes);
      this.allQuotes = quotes;
      this.currentIndex = this.findStartingQuote();
      this.displayQuote();
      this.memoryService.searchQuotesResult = null;
    } else {
      let quoteId: string = this.activeRoute.snapshot.params['quoteId'];
      if (quoteId) {
        this.startingId = parseInt(quoteId);
      }
      this.searching = true;
      this.searchingMessage = 'Retrieving quote list...';
      this.memoryService.getQuoteList().subscribe((quotes: Quote[]) => {
        if (!quotes || quotes.length === 0) {
          this.searching = false;
          this.searchingMessage = null;
          return;
        }
        quotes = BrowseQuotesComponent.filterOutNonApprovedQuotes(quotes);
        if (!quotes || quotes.length === 0) {
          this.searching = false;
          this.searchingMessage = null;
          return;
        }
        PassageUtils.shuffleArray(quotes);
        this.allQuotes = quotes;
        this.currentIndex = this.findStartingQuote();
        this.displayQuote();
        this.searching = false;
        this.searchingMessage = null;
      });
    }
  }

  private static filterOutNonApprovedQuotes(quotes: Quote[]): Quote[] {
    let modQuotes: Quote[] = [];
    for (let quote of quotes) {
      if (StringUtils.isEmpty(quote.approved) || quote.approved === 'Y') {
        modQuotes.push(quote);
      }
    }
    return modQuotes;
  }

  private findStartingQuote(): number {
    for (let i: number = 0; i < this.allQuotes.length; i++) {
      if (this.allQuotes[i].objectionId == this.startingId) {
        return i;
      }
    }
    return 0;
  }
  swipe(action) {
    if (window.screen.width > 500) { // 768px portrait
      // this is Desktop, so don't allow swipe
      console.log("Not allowing swipe");
      return;
    }
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.direction = 'prev' + new Date();
      this.prev();
    }

    if (action === this.SWIPE_ACTION.LEFT) {
      this.direction = 'next' + new Date();
      this.next();
    }
  }

  next() {
    this.currentIndex = PassageUtils.getNextIndex(this.currentIndex, this.allQuotes.length, true);
    this.displayQuote();
  }

  prev() {
    this.currentIndex = PassageUtils.getNextIndex(this.currentIndex, this.allQuotes.length, false);
    this.displayQuote();
  }

  private displayQuote() {
    this.editingQuote = false;
    this.currentQuote = PassageUtils.updateLineFeedsWithBr(this.allQuotes[this.currentIndex].answer);
    this.currentQuoteForClipboard = this.allQuotes[this.currentIndex].answer;
  }

  toggleAdditionalOptions() {
    this.isCollapsed = !this.isCollapsed;
  }

  addNewQuote() {
    this.isCollapsed = true;
    this.route.navigate(['addQuote']);
  }

  open(content) {
    this.isCollapsed = true;
    this.searching = true;
    this.searchingMessage = "Retrieving users...";
    this.memoryService.getAllUsers().subscribe((users: MemUser[]) => {
      console.log(users);
      this.users = PassageUtils.sortUserListByName(users);
      this.searchingMessage = "Retrieving email mappings...";
      this.memoryService.getEmailMappings({user: this.currUser}).subscribe((mappings: any[]) => {
        this.mappings = mappings;
        this.searching = false;
        this.searchingMessage = null;
      });

      this.openModal = this.modalService.open(content);
      this.openModal.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${BrowseQuotesComponent.getDismissReason(reason)}`;
      });
    });
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private getDefaultEmail(user: MemUser): string {
    if (!this.mappings || this.mappings.length === 0) {
      return "";
    }
    for (let mapping of this.mappings) {
      if (mapping.userName === user.userName) {
        return mapping.emailAddress;
      }
    }
    return "";
  }

  sendQuoteToUser(user: MemUser) {
    if (this.openModal) {
      this.openModal.close();
    }
    let modalHelper: ModalHelperService = this.injector.get(ModalHelperService);
    let defaultEmail = this.getDefaultEmail(user);
    this.modalHelperService.confirm({ message: "Send current quote to user " + user.userName + "?", header: "Send Quote" }).result.then(
      () => {
        modalHelper.openEnterEmail(defaultEmail).result.then((email: string) => {
          console.log("Sending quote to: ");
          console.log(user);
          this.searching = true;
          this.searchingMessage = 'Sending quote to ' + user.userName + '...';
          let param: any = {
            user: user,
            fromUser: this.memoryService.getCurrentUser(),
            quote: this.allQuotes[this.currentIndex],
            emailTo: email
          };
          this.memoryService.sendQuoteToUser(param).subscribe((response: any) => {
            if (response === 'error') {
              console.log('Unable to send quote to ' + user + '...');
            } else {
              console.log('Here is the quote sent to ' + user + ':');
              console.log(response);
            }
            this.searching = false;
            this.searchingMessage = null;
          });
        }, () => {
          console.log("No email entered, NOT Sending quote to: ");
          console.log(user);
        });
      },
      () => {
        console.log("NOT Sending quote to: ");
        console.log(user);
      }
    );
  }

  logIt(event: any, mode: string) {
    // console.log('Here is the mode: ' + mode + '.  Here is the event: ');
    // console.log(event);
  }

  clipboardCopyComplete() {
    this.toastr.info('The passage has been copied to the clipboard!', 'Success!');
  }

  updateQuote() {
    this.searching = true;
    this.searchingMessage = "Updating quote...";
    this.allQuotes[this.currentIndex].answer = this.currentQuoteUpdatedText;
    console.log("Here is the updated quote:");
    console.log(this.allQuotes[this.currentIndex]);
    this.memoryService.updateQuote(this.allQuotes[this.currentIndex]).subscribe(response => {
      this.editingQuote = false;
      this.searching = false;
      this.searchingMessage = null;
      this.displayQuote();
    }, () => {
      this.searching = false;
      this.searchingMessage = null;
    });
  }

  editQuote() {
    this.editingQuote = true;
    this.isCollapsed = true;
    let lineFeeds = this.currentQuoteForClipboard.split("\n").length * 2;
    this.rowCount = Math.ceil((this.currentQuoteForClipboard.length + lineFeeds) / this.editTextElem.nativeElement.cols);
    // console.log("displayQuote - lineFeeds=" + lineFeeds + ",quoteLength=" + this.currentQuoteForClipboard.length + ", colCount=" + this.editTextElem.nativeElement.cols + ",rowCount" + this.rowCount);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.colCount = this.editTextElem.nativeElement.cols;
    }, 500);
  }

  updateText(value: string) {
    this.currentQuoteUpdatedText = value;
  }
}
