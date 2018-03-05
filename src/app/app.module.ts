import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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
import { WorkflowService } from './workflow/workflow.service';
import { ForbiddenValidatorDirective, 
  JuriNameValidator, 
  PhoneNumberValidator, 
  EmailValidator, 
  SSNValidator,
  DOBValidator,
  ZipCodeValidator,
  ABARoutingValidator,
  AccountNumberValidator } from './shared/custom-validations.directive';

/* Animation Modules */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    { provide: FormDataService, useClass: FormDataService },
    { provide: WorkflowService, useClass: WorkflowService }
  ],
  declarations: [
      AppComponent, NavbarComponent, PersonalComponent, IncomeComponent, 
      BankComponent, AddressComponent, ResultComponent, ForbiddenValidatorDirective,
      JuriNameValidator, PhoneNumberValidator, EmailValidator, SSNValidator, DOBValidator,
      ZipCodeValidator, ABARoutingValidator, AccountNumberValidator
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }