import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddNonbibleMemoryFactComponent } from './add-nonbible-memory-fact/add-nonbible-memory-fact.component';
import { AddNonbibleQuoteComponent } from './add-nonbible-quote/add-nonbible-quote.component';
import { AlertComponent } from './alert/alert.component';
import { BibleSearchComponent } from './bible-search/bible-search.component';
import { BrowseNuggetsComponent } from './browse-nuggets/browse-nuggets.component';
import { BrowsePassageComponent } from './browse-passage/browse-passage.component';
import { BrowseQuotesComponent } from './browse-quotes/browse-quotes.component';
import { BrowseTopicComponent } from './browse-topic/browse-topic.component';
import { ChapterSelectionComponent } from './chapter-selection/chapter-selection.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { CopyDbToGuestComponent } from './copy-db-to-guest/copy-db-to-guest.component';
import { EditPassageComponent } from './edit-passage/edit-passage.component';
import { EnterEmailPopupComponent } from './enter-email-popup/enter-email-popup.component';
import { ListFactsAndQuotesComponent } from './list-facts-and-quotes/list-facts-and-quotes.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ManageEmailsComponent } from './manage-emails/manage-emails.component';
import { MemoryStatsComponent } from './memory-stats/memory-stats.component';
import { MyVerseListComponent } from './my-verse-list/my-verse-list.component';
import { PassageNavigationComponent } from './passage-navigation/passage-navigation.component';
import { PracticeNonbibleMemoryFactsComponent } from './practice-nonbible-memory-facts/practice-nonbible-memory-facts.component';
import { PracticeSetupComponent } from './practice-setup/practice-setup.component';
import { PracticeComponent } from './practice/practice.component';
import { QuoteSearchResultActionsComponent } from './quote-search-result-actions/quote-search-result-actions.component';
import { QuotesNoLoginComponent } from './quotes-no-login/quotes-no-login.component';
import { RandomTopicComponent } from './random-topic/random-topic.component';
import { ReadingPlanComponent } from './reading-plan/reading-plan.component';
import { SearchFactsAndQuotesComponent } from './search-facts-and-quotes/search-facts-and-quotes.component';
import { SearchComponent } from './search/search.component';
import { SelectQuotesComponent } from './select-quotes/select-quotes.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { ViewBiblePassageComponent } from './view-bible-passage/view-bible-passage.component';
import { ViewChapterComponent } from './view-chapter/view-chapter.component';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    ViewBiblePassageComponent,
    LoginComponent,
    MyVerseListComponent,
    PassageNavigationComponent,
    PracticeComponent,
    PracticeSetupComponent,
    SearchComponent,
    EditPassageComponent,
    BibleSearchComponent,
    ViewChapterComponent,
    ChapterSelectionComponent,
    MainMenuComponent,
    TopicListComponent,
    BrowseTopicComponent,
    RandomTopicComponent,
    MemoryStatsComponent,
    BrowseNuggetsComponent,
    BrowsePassageComponent,
    AddNonbibleMemoryFactComponent,
    PracticeNonbibleMemoryFactsComponent,
    AddNonbibleQuoteComponent,
    BrowseQuotesComponent,
    SearchFactsAndQuotesComponent,
    CopyDbToGuestComponent,
    ConfirmComponent,
    AlertComponent,
    EnterEmailPopupComponent,
    SelectQuotesComponent,
    SelectUserComponent,
    QuotesNoLoginComponent,
    QuoteSearchResultActionsComponent,
    ManageEmailsComponent,
    ReadingPlanComponent,
    ListFactsAndQuotesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 1000
    }),
    ClipboardModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
