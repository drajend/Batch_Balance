import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Routes Declarations
import {ProcessBatchComponent} from 'app/process-batch/process-batch.component'
import {QABatchComponent} from 'app/qabatch/qabatch.component'

const routes: Routes = [
  { path: 'processbatch', component: ProcessBatchComponent  },
  { path: 'qabatch', component: QABatchComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
