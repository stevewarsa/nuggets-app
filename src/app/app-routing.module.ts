import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNonbibleMemoryFactComponent } from './add-nonbible-memory-fact/add-nonbible-memory-fact.component';
import { AddNonbibleQuoteComponent } from './add-nonbible-quote/add-nonbible-quote.component';
import { BibleSearchComponent } from './bible-search/bible-search.component';
import { BrowseNuggetsComponent } from './browse-nuggets/browse-nuggets.component';
import { BrowseQuotesComponent } from './browse-quotes/browse-quotes.component';
import { BrowseTopicComponent } from './browse-topic/browse-topic.component';
import { ChapterSelectionComponent } from './chapter-selection/chapter-selection.component';
import { CopyDbToGuestComponent } from './copy-db-to-guest/copy-db-to-guest.component';
import { EditPassageComponent } from './edit-passage/edit-passage.component';
import { ListFactsAndQuotesComponent } from './list-facts-and-quotes/list-facts-and-quotes.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ManageEmailsComponent } from './manage-emails/manage-emails.component';
import { MemoryStatsComponent } from './memory-stats/memory-stats.component';
import { MyVerseListComponent } from './my-verse-list/my-verse-list.component';
import { PracticeNonbibleMemoryFactsComponent } from './practice-nonbible-memory-facts/practice-nonbible-memory-facts.component';
import { PracticeSetupComponent } from './practice-setup/practice-setup.component';
import { PracticeComponent } from './practice/practice.component';
import { QuotesNoLoginComponent } from './quotes-no-login/quotes-no-login.component';
import { RandomTopicComponent } from './random-topic/random-topic.component';
import { ReadingPlanComponent } from './reading-plan/reading-plan.component';
import { SearchFactsAndQuotesComponent } from './search-facts-and-quotes/search-facts-and-quotes.component';
import { SearchComponent } from './search/search.component';
import { SelectQuotesComponent } from './select-quotes/select-quotes.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { ViewChapterComponent } from './view-chapter/view-chapter.component';
import { BibleStatsComponent } from "src/app/bible-stats/bible-stats.component";


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'main', component: MainMenuComponent},
  {path: 'copyThisDbToGuest', component: CopyDbToGuestComponent},
  {path: 'practiceSetup', component: PracticeSetupComponent},
  {path: 'addMemoryFact', component: AddNonbibleMemoryFactComponent},
  {path: 'addQuote', component: AddNonbibleQuoteComponent},
  {path: 'practiceFacts', component: PracticeNonbibleMemoryFactsComponent},
  {path: 'searchFactsAndQuotes', component: SearchFactsAndQuotesComponent},
  {path: 'listFactsAndQuotes', component: ListFactsAndQuotesComponent},
  {path: 'selectQuotes', component: SelectQuotesComponent},
  {path: 'search', component: SearchComponent},
  {path: 'bibleSearch', component: BibleSearchComponent},
  {path: 'chapterSelection', component: ChapterSelectionComponent},
  {path: 'edit', component: EditPassageComponent},
  {path: 'myverselist', component: MyVerseListComponent},
  {path: 'memorystats', component: MemoryStatsComponent},
  {path: 'biblestats', component: BibleStatsComponent},
  {path: 'topiclist', component: TopicListComponent},
  {path: 'randomtopic', component: RandomTopicComponent},
  {path: 'browsenuggets', component: BrowseNuggetsComponent},
  {path: 'manageEmails', component: ManageEmailsComponent},
  {path: 'browsequotes', component: BrowseQuotesComponent},
  {path: 'browsequotes/:quoteId', component: BrowseQuotesComponent},
  {path: 'quotes', component: QuotesNoLoginComponent},
  {path: 'browseTopic', component: BrowseTopicComponent},
  {path: 'viewPassage', component: ViewChapterComponent},
  {path: 'viewChapter', component: ViewChapterComponent},
  {path: 'readingPlan', component: ReadingPlanComponent},
  {path: 'practice', component: PracticeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
