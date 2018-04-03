import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { FormData, Personal, Address, Income, Bank, Result } from './formData.model';
import { WorkflowService } from '../workflow/workflow.service';
import { STEPS } from '../workflow/workflow.model';

@Injectable()
export class FormDataService {

    private formData: FormData = new FormData();
    private isPersonalFormValid: boolean = false;
    private isIncomeFormValid: boolean = false;
    // private isWorkFormValid: boolean = false;
    private isBankFormValid: boolean = false;
    private isAddressFormValid: boolean = false;
    private isResultFormValid: boolean = true;

    constructor(private workflowService: WorkflowService) {
    }

    getPersonal(): Personal {
        // Return the Personal data
        var personal: Personal = {
            loanAmount: this.formData.loanAmount,
            termPeriod: this.formData.termPeriod,
            zip: this.formData.zip,
            city: this.formData.city,
            state: this.formData.state,
            prefix: this.formData.prefix,
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            homePhone: this.formData.homePhone,
            workPhone: this.formData.workPhone,
            mobilePhone: this.formData.mobilePhone,
            email: this.formData.email,
            dob: this.formData.dob,
            DateofBirth: this.formData.DateofBirth,
            nationalIdentityNumber: this.formData.nationalIdentityNumber,
            driversLicense: this.formData.driversLicense,
            issuingState: this.formData.issuingState,
            militaryService: this.formData.militaryService
        };
        return personal;
    }

    setUserLocation(data: Personal) {
        this.formData.city = data.city;
        this.formData.state = data.state;
        this.formData.issuingState = data.issuingState;
        this.formData.zip = data.zip;
        this.formData.homePhone = data.homePhone;
        this.formData.mobilePhone = data.mobilePhone;
        this.formData.workPhone = data.workPhone;
    }

    setPersonal(data: Personal) {
        // Update the Personal data only when the Personal Form had been validated successfully
        this.isPersonalFormValid = true;
        this.formData.loanAmount = data.loanAmount;
        this.formData.termPeriod = data.termPeriod;
        this.formData.prefix = data.prefix;
        this.formData.firstName = data.firstName;
        this.formData.lastName = data.lastName;
        this.formData.homePhone = data.homePhone;
        this.formData.workPhone = data.workPhone;
        this.formData.mobilePhone = data.mobilePhone;
        this.formData.email = data.email;
        this.formData.dob = data.dob;
        this.formData.DateofBirth = "\/Date(" + String(new Date(data.dob).getTime()) + ")\/";
        this.formData.nationalIdentityNumber = data.nationalIdentityNumber;
        this.formData.driversLicense = data.driversLicense;
        this.formData.issuingState = data.issuingState;
        this.formData.militaryService = data.militaryService;
        // Validate Personal Step in Workflow
        this.workflowService.validateStep(STEPS.personal);
    }

    getIncome(): Income {
        // Return the Income data
        var income: Income = {
            incomeSource: this.formData.incomeSource,
            employmentStarted: this.formData.employmentStarted,
            employerName: this.formData.employerName,
            paymentType: this.formData.paymentType,
            employmentYears: this.formData.employmentYears,
            employmentMonths: this.formData.employmentMonths,
            payFrequency: this.formData.payFrequency,
            nextPayDate: this.formData.nextPayDate,
            followingPayDate: this.formData.followingPayDate,
            netAmount: this.formData.netAmount,
            jobTitle: this.formData.jobTitle,
        };
        return income;
    }

    setIncome(data: Income) {
        // Update the Income data only when the Income Form had been validated successfully

        //Calculate what day users started working
        let years1 = Number(data.employmentMonths.replace(/\D/g, '')) / 12;
        let years2 = Number(data.employmentYears.replace(/\D/g, ''));
        let totalDays = (years1 + years2) * 365;
        console.log(totalDays);

        let employmentStarted = moment.utc().subtract(totalDays, 'days').format('ll');
        console.log(employmentStarted);
        //End calculation for what day users started working

        //Calculate next payday and following payday

        //1 = Weekly  
        if (data.payFrequency == '1') {
            let endOfWeek = moment.utc().endOf('week').subtract(1, 'days').format('ll') //returns first Friday's date
            let followingEndofWeek = moment.utc().endOf('week').subtract(1, 'days').add(7, 'days').format('ll');

            data.nextPayDate = "\/Date(" + String(new Date(endOfWeek).getTime()) + ")\/"
            data.followingPayDate = "\/Date(" + String(new Date(followingEndofWeek).getTime()) + ")\/"
        }
        //2 = BiWeekly
        else if (data.payFrequency == '2') {
            //Payday is two weeks after start date, at the end of the week (Friday)
            let payDay = moment(employmentStarted).utc().add(2, 'weeks').endOf('week').subtract(1, 'days').format('ll'); //returns Friday of week 2
            let payDayEpoch = new Date(payDay).getTime();

            let now = moment.utc().format('ll');
            let nowEpoch = new Date(now).getTime();

            let nowPlusFourWeeks = moment.utc().add(4, 'weeks').endOf('week').subtract(1, 'days').format('ll');
            let nowPlusFourWeeksEpoch = new Date(nowPlusFourWeeks).getTime();

            var i = 0;
            let payArray = [];
            //While loop clocks every biweekly payday from start date until four weeks from now
            while (payDayEpoch < nowPlusFourWeeksEpoch) {
                i += 2
                //payday is every two weeks from when user started, at the end of the week (Friday)
                payDay = moment(employmentStarted).utc().add(i, 'weeks').endOf('week').subtract(1, 'days').format('ll');
                payDayEpoch = new Date(payDay).getTime();

                //Adds biweekly payday to array if paydays are after today
                if (payDayEpoch > nowEpoch) {
                    payArray.push(payDay);
                    console.log(payDay);
                }
            }
            //Assigns the first two biweekly paydays after today's date 
            data.nextPayDate = "\/Date(" + String(new Date(moment(payArray[0]).utc().format('ll')).getTime()) + ")\/";
            data.followingPayDate = "\/Date(" + String(new Date(moment(payArray[1]).utc().format('ll')).getTime()) + ")\/";
            console.log(payArray);
        }
        //3 = Fortnightly or Semi-Monthly
        else if (data.payFrequency == '3') {
            //something
        }
        // 4 = LastDayMonth
        else if (data.payFrequency == '4') {
            let endOfMonth = moment().endOf('month').format('ll'); //returns last day of month
            let endOfMonthDay = moment().endOf('month').format('llll').slice(0, 3); //returns Day of Month i.e. Sun, Mon, Tues, etc...

            let followingEndOfMonth = moment().add(1, 'months').endOf('month').format('ll'); //returns last day of month
            let followingEndOfMonthDay = moment().add(1, 'months').endOf('month').format('llll').slice(0,3);

            if (endOfMonthDay == 'Sun' || followingEndOfMonthDay == 'Sun') {
                endOfMonth = moment().endOf('month').subtract(2, 'days').format('ll');
                followingEndOfMonth = moment().add(1, 'months').endOf('month').subtract(2, 'days').format('ll');
            }
            else if (endOfMonthDay == 'Sat' || followingEndOfMonthDay == 'Sat') {
                endOfMonth = moment().endOf('month').subtract(1, 'days').format('ll');
                followingEndOfMonth = moment().add(1, 'months').endOf('month').subtract(1, 'days').format('ll');
            }

            data.nextPayDate = "\/Date(" + String(new Date(endOfMonth).getTime()) + ")\/";
            data.followingPayDate = "\/Date(" + String(new Date(followingEndOfMonth).getTime()) + ")\/";
        }
        //End calculate next payday and following payday


        this.isIncomeFormValid = true;
        this.formData.incomeSource = data.incomeSource;
        this.formData.employmentStarted = "\/Date(" + String(new Date(employmentStarted).getTime()) + ")\/";
        this.formData.employerName = data.employerName;
        this.formData.paymentType = data.paymentType;
        this.formData.employmentYears = data.employmentYears;
        this.formData.employmentMonths = data.employmentMonths;
        this.formData.payFrequency = data.payFrequency;
        this.formData.nextPayDate = data.nextPayDate;
        this.formData.followingPayDate = data.followingPayDate;
        this.formData.netAmount = data.netAmount;
        this.formData.jobTitle = data.jobTitle;
        // Validate Income Step in Workflow
        this.workflowService.validateStep(STEPS.income);
    }

    getBank(): Bank {
        // Return the bank type
        var bank: Bank = {
            bankName: this.formData.bankName,
            accountNumber: this.formData.accountNumber,
            routingNumber: this.formData.routingNumber,
            bankTimeYears: this.formData.bankTimeYears,
            bankTimeMonths: this.formData.bankTimeMonths,
            accountType: this.formData.accountType,
            bankAccountOpened: this.formData.bankAccountOpened
        };
        return bank;
    }

    clearRoutingNumber(data: Bank) {
        this.formData.routingNumber = '';
    }

    setRoutingNumber(data: Bank) {
        this.formData.routingNumber = data.routingNumber;
    }

    setBank(data: Bank) {
        // Update the bank type only when the Bank Form had been validated successfully

        //Calculate day
        let years1 = Number(data.bankTimeMonths.replace(/\D/g, '')) / 12;
        let years2 = Number(data.bankTimeYears.replace(/\D/g, ''));
        let totalDays = (years1 + years2) * 365;
        console.log(totalDays);

        let accountCreated = moment().subtract(totalDays, 'days').calendar();
        console.log(accountCreated);
        //End calculation for day


        this.isBankFormValid = true;
        this.formData.bankName = data.bankName;
        this.formData.accountNumber = data.accountNumber;
        this.formData.routingNumber = data.routingNumber;
        this.formData.bankTimeYears = data.bankTimeYears;
        this.formData.bankTimeMonths = data.bankTimeMonths;
        this.formData.accountType = data.accountType;
        this.formData.bankAccountOpened = "\/Date(" + String(new Date(accountCreated).getTime()) + ")\/";
        // Validate Bank Step in Workflow
        this.workflowService.validateStep(STEPS.bank);
    }

    getAddress(): Address {
        // Return the Address data
        var address: Address = {
            street: this.formData.street,
            city: this.formData.city,
            state: this.formData.state,
            zip: this.formData.zip,
            residentialStatus: this.formData.residentialStatus,
            addressYears: this.formData.addressYears,
            addressMonths: this.formData.addressMonths,
            addressMoveIn: this.formData.addressMoveIn
        };
        return address;
    }

    setCity(data: Address) {
        this.formData.city = data.city;
    }

    setState(data: Address) {
        this.formData.state = data.state;
    }

    setAddress(data: Address) {
        // Update the Address data only when the Address Form had been validated successfully

        //Calculate what day users moved into their house/apartment
        let years1 = Number(data.addressMonths.replace(/\D/g, '')) / 12;
        let years2 = Number(data.addressYears.replace(/\D/g, ''));
        let totalDays = (years1 + years2) * 365;
        console.log(totalDays);

        let moveInDate = moment().subtract(totalDays, 'days').calendar();
        console.log(moveInDate);
        //End calculation for what day users moved into their house/apartment

        this.isAddressFormValid = true;
        this.formData.street = data.street;
        this.formData.city = data.city;
        this.formData.state = data.state;
        this.formData.zip = data.zip;
        this.formData.addressMonths = data.addressMonths;
        this.formData.addressYears = data.addressYears;
        this.formData.residentialStatus = data.residentialStatus;
        this.formData.addressMoveIn = "\/Date(" + String(new Date(moveInDate).getTime()) + ")\/";
        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.address);
    }

    getResult(): Result {
        // Return the Address data
        var result: Result = {
            consentToCreditSearch: this.formData.consentToCreditSearch
        };
        return result;
    }

    setResult(data: Result) {
        // Update the Address data only when the Address Form had been validated successfully
        this.isResultFormValid = true;
        this.formData.consentToCreditSearch = data.consentToCreditSearch;

        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.result);
    }

    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }

    resetFormData(): FormData {
        // Reset the workflow
        this.workflowService.resetSteps();
        // Return the form data after all this.* members had been reset
        this.formData.clear();
        this.isPersonalFormValid = this.isIncomeFormValid = this.isBankFormValid = this.isAddressFormValid = this.isResultFormValid = false;
        return this.formData;
    }

    isFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
        return this.isPersonalFormValid &&
            this.isIncomeFormValid &&
            this.isBankFormValid &&
            this.isResultFormValid &&
            this.isAddressFormValid;
    }
}

// let userStartDate = new Date('01/2/2018');
// let userDateEpoch = userStartDate.getTime();

// let payDay = moment(userStartDate).utc().add(2, 'weeks').endOf('week').subtract(1, 'days').format('llll'); //returns Friday of week 2
// console.log(payDay);
// let payDayEpoch = new Date(payDay).getTime();

// let now = moment.utc().format('ll');
// let nowEpoch = new Date(now).getTime();

// let nowPlusFourWeeks = moment.utc().add(4, 'weeks').endOf('week').subtract(1, 'days').format('llll');
// let nowPlusFourWeeksEpoch = new Date(nowPlusFourWeeks).getTime();

// var i = 0;
// let payArray = [];
// while (payDayEpoch < nowPlusFourWeeksEpoch) {
//     i += 2
//     payDay = moment(userStartDate).utc().add(i, 'weeks').endOf('week').subtract(1, 'days').format('llll');
//     payDayEpoch = new Date(payDay).getTime();

//     if (payDayEpoch > new Date().getTime()) {
//         payArray.push(payDay);
//         console.log(payDay);
//     }
// }
// console.log(payArray);







