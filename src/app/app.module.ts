import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* App Root */
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

/* Feature Components */
import { PersonalComponent } from './personal/personal.component';
import { IncomeComponent } from './income/income.component';
// import { WorkComponent } from './work/work.component';
import { BankComponent } from './bank/bank.component';
import { AddressComponent } from './address/address.component';
import { ResultComponent } from './result/result.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* Shared Service */
import { FormDataService } from './data/formData.service';
import {FormData} from './data/formData.model'
import { WorkflowService } from './workflow/workflow.service';
import { PingYoService } from './shared/pingyo.service';
import {
  PhoneNumberValidator, 
  EmailValidator, 
  SSNValidator,
  DOBValidator,
  ZipCodeValidator,
  ABARoutingValidator,
  AccountNumberValidator,
  UppercaseDirective,
  StateValidator,
  MonthlyAmountValidator } from './shared/custom-validations.directive';

import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [
    { provide: FormDataService, useClass: FormDataService },
    { provide: WorkflowService, useClass: WorkflowService },
    { provide: FormData, useClass: FormData},
    { provide: PingYoService, useClass: PingYoService }
  ],
  declarations: [
      AppComponent, NavbarComponent, PersonalComponent, IncomeComponent, 
      BankComponent, AddressComponent, ResultComponent, PhoneNumberValidator, EmailValidator, SSNValidator, DOBValidator,
    ZipCodeValidator, ABARoutingValidator, AccountNumberValidator, UppercaseDirective, StateValidator,
    MonthlyAmountValidator,
    HeaderComponent
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }