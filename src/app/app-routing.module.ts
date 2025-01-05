import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './shared/components/contact-list/contact-list.component';
import { UploadExcelComponent } from './shared/components/upload-excel/upload-excel.component';
import { ContactDetailComponent } from './shared/components/contact-detail/contact-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ContactListComponent
  },
  {
    path: 'upload-contact',
    component: UploadExcelComponent
  },
  {
    path: 'contact/:id',
    component: ContactDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
