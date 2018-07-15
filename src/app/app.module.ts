import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { DataTableModule } from './data-table';
// import {DataTable} from 'angular-2-data-table'
//import {Ng2SmartTableModule} from 'ng2-smart-table';

import { SafePipe } from './app.safe.pipe';
import { AppComponent } from './app.component';
import { ProcessBatchComponent } from './process-batch/process-batch.component';
import { QABatchComponent } from './qabatch/qabatch.component';
import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';
import { AngularSplitModule } from 'angular-split';

@NgModule({
  declarations: [
    AppComponent,
    ProcessBatchComponent,
    QABatchComponent,
    SafePipe
  ],
  imports: [
    AngularSplitModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    AppRoutingModule,
    SplitPaneModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
