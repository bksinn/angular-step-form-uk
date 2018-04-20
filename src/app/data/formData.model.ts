import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class FormData {
    loanAmount: string = '250';
    termPeriod: string = '';
    prefix: string = '';
    firstName: string = '';
    lastName: string = '';
    homePhone: string = '';
    workPhone: string = '';
    mobilePhone: string = '';
    email: string = '';
    dob: string = '';
    DateofBirth: string = "";
    nationalIdentityNumber: string = '';
    nationalIdentityNumberType: number = 2;
    driversLicense: string = '';
    issuingState: string = '';
    militaryService: string = '';

    incomeSource: string = '';
    employmentStarted: string = '';
    employerName: string = '';
    paymentType: string = '';
    employmentYears: string = '';
    employmentMonths: string = '';
    payFrequency: string = '';
    nextPayDate: string = '';
    followingPayDate: string = '';
    netAmount: string = '';
    jobTitle: string = '';

    street: string = '';
    city: string = '';
    state: string = '';
    county: string = '';
    zip: string = '';
    addressMonths: string = '';
    addressYears: string = '';
    residentialStatus: string = '';
    addressMoveIn: string = '';

    bankName: string = '';
    accountNumber: string = '';
    routingNumber: string = '';
    bankTimeYears: string = '';
    bankTimeMonths: string = '';
    accountType: string = '';
    bankCardType: number = 5; //Visa Debit
    bankAccountOpened: string = '';

    consentToCreditSearch: boolean = true;

    typeAheadAreaCode: Array<any> = [];
    typeAheadState: Array<any> = [];
    typeAheadCity: Array<any> = [];
    typeAheadBank: Array<any> = [];
    typeAheadRouting: Array<any> = [];

    percentFormComplete: number = 20;

    clear() {
        this.loanAmount = '';
        this.termPeriod = '';
        this.prefix = '';
        this.firstName = '';
        this.lastName = '';
        this.homePhone = '';
        this.workPhone = '';
        this.mobilePhone = '';
        this.email = '';
        this.dob = '';
        this.nationalIdentityNumber = '';
        this.driversLicense = '';
        this.issuingState = '';
        this.driversLicense = '';

        this.incomeSource = '';
        this.employmentStarted = '';
        this.employerName = '';
        this.paymentType = '';
        this.employmentYears = '';
        this.employmentMonths = '';
        this.payFrequency = '';
        this.nextPayDate = '';
        this.followingPayDate = '';
        this.netAmount = '';
        this.jobTitle = '';

        this.street = '';
        this.city = '';
        this.state = '';
        this.county = '';
        this.zip = '';
        this.addressMonths = '';
        this.addressYears = '';
        this.residentialStatus = '';
        this.addressMoveIn = '';

        this.bankName = '';
        this.accountNumber = '';
        this.routingNumber = '';
        this.bankTimeYears = '';
        this.bankTimeMonths = '';
        this.accountType = '';
        this.bankAccountOpened = '';
    }
}

export class Personal {
    loanAmount: string = '';
    termPeriod: string = '';
    zip: string = '';
    city: string = '';
    state: string = '';
    county: string = '';
    prefix: string = '';
    firstName: string = '';
    lastName: string = '';
    homePhone: string = '';
    workPhone: string = '';
    mobilePhone: string = '';
    email: string = '';
    dob: string = '';
    DateofBirth: string = "";
    nationalIdentityNumber: string = '';
    driversLicense: string = '';
    issuingState: string = '';
    militaryService: string = '';
}

export class Income {
    incomeSource: string = '';
    employmentStarted: string = '';
    employerName: string = '';
    paymentType: string = '';
    employmentYears: string = '';
    employmentMonths: string = '';
    payFrequency: string = '';
    nextPayDate: string = '';
    followingPayDate: string = '';
    netAmount: string = '';
    jobTitle: string = '';
}

export class Address {
    street: string = '';
    city: string = '';
    state: string = '';
    county: string = '';
    zip: string = '';
    addressMonths: string = '';
    addressYears: string = '';
    residentialStatus: string = '';
    addressMoveIn: string = '';
}

export class Bank {
    bankName: string = '';
    accountNumber: string = '';
    routingNumber: string = '';
    bankTimeYears: string = '';
    bankTimeMonths: string = '';
    accountType: string = '';
    bankCardType: number = 5; //Visa Debit
    bankAccountOpened: string = '';
}

export class Result {
    consentToCreditSearch: boolean = true;
}
