import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../data/formData.model';
import { FormData } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';

let mockObj = {
    "Campaign": null,
    "AffiliateId": "TOMJ-A",
    "SubAffiliate": null,
    "Timeout": 120,
    "TestOnly": false,
    "Application": {
        "Title": 1,
        "FirstName": "Christine",
        "LastName": "Aldis",
        "DateOfBirth": "/Date(158716800000)/",
        "Email": "christinealdis@hotmail.com",
        "HomePhoneNumber": "07504 417732",
        "MobilePhoneNumber": "07504 417732",
        "WorkPhoneNumber": "07504 417732",
        "EmployerName": "Fishersltd",
        "JobTitle": null,
        "EmploymentStarted": "/Date(1453507200000)/",
        "EmployerIndustry": 14,
        "IncomeSource": 2,
        "PayFrequency": 3,
        "PayAmount": "1900",
        "IncomePaymentType": 4,
        "NextPayDate": "/Date(1522368000000)/",
        "FollowingPayDate": "/Date(1523577600000)/",
        "LoanAmount": "350",
        "NationalIdentityNumber": null,
        "NationalIdentityNumberType": 1,
        "ConsentToCreditSearch": true,
        "ConsentToMarketingEmails": false,
        "ResidentialStatus": 1,
        "HouseNumber": "48",
        "HouseName": null,
        "AddressStreet1": "st duntans  road",
        "AddressCity": "Hounslow",
        "AddressCountryCode": "GB",
        "AddressCounty": "Middlesex",
        "AddressMoveIn": "/Date(1453507200000)/",
        "AddressPostcode": "TW4 7QP",
        "BankAccountNumber": "10245563",
        "BankCardType": 4,
        "BankRoutingNumber": "111371",
        "MonthlyMortgageRent": "220",
        "MonthlyCreditCommitments": "100",
        "OtherExpenses": "100",
        "Transport": "60",
        "Food": "80",
        "Utilities": "60",
        "MinimumCommissionAmount": 0,
        "MaximumCommissionAmount": 0,
        "ApplicationExtensions": null,
        "LoanAmountCurrencyCode": null,
        "PayAmountCurrencyCode": null
    },
    "SourceDetails": {
        "Address": "94.0.62.230",
        "ClientUserAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
        "CreationUrl": "https://www.my-loans.co.uk/",
        "LanguageCodes": null,
        "ReferringUrl": "https://www.my-loans.co.uk/"
    }
}


@Component({
    selector: 'mt-wizard-result',
    templateUrl: './result.component.html',
})

@Injectable()
export class ResultComponent implements OnInit {
    title = 'Terms and Conditions';
    @Input() formData: FormData;
    result: Result;
    form: any;
    isFormValid: boolean = false;
    submitted: boolean = false; //Check if form is submitted
    submitSuccess: boolean = false;
    submitFail: boolean = false;
    countDown;
    count = 10;
    testUrl: string = 'https://jsonplaceholder.typicode.com/posts';
    postUrl: string = 'https://leads.pingyo.co.uk/application/submit/';
    getUrl: string = 'http://leads.pingyo.co.uk/application/status/';
    correlationId: string = 'b3486376-d50b-4dc4-bea7-fdaaf13b4e22';
    redirectionUrl;
    percentComplete = 0;
    countDown2;
    count2 = 5;

    constructor(private router: Router, private formDataService: FormDataService, private http:HttpClient) {
        // this.countDown = timer(0, 1000).pipe(
        //     take(this.count),
        //     map(() => {
        //         this.percentComplete += 25;
        //         return --this.count
        //     })
        // );

        this.countDown2 = timer(0, 1000).pipe(
            take(this.count2),
            map(() => {
                if (this.count2 < 2) {
                    console.log(this.redirectionUrl);
                    //window.location.href = this.redirectionUrl;
                }
                return --this.count2;
            })
        );
    }

    ngOnInit() {
        this.result = this.formDataService.getResult();
        this.formData = this.formDataService.getFormData();
        this.isFormValid = this.formDataService.isFormValid();
        console.log('Result feature loaded!');
        console.log(this.result)
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setResult(this.result);
        return true;
    }

    goToPrevious(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the personal page
            this.router.navigate(['/bank']);
        }
    }

    resetSubmit () {
        this.submitted = false;
        this.submitFail = false;
        this.submitSuccess = false;
        this.count = 10;
        this.count2 = 5;
        this.percentComplete = 0;

        //Replaces Nav Bar
        document.getElementById('status-buttons').removeAttribute('style');
    }

    submit(form: any) {
        window.scrollTo(0, 0);
        if (this.save(form)) {
            // Navigate to the result page
            //this.router.navigate(['/personal']);
            console.log("FINISHED!");
        }
        else {
            console.log("FORM INCOMPLETE");
        }
    }

    processForm () {
        let jsonMockObj = JSON.stringify(mockObj);
        const jsonFormData = JSON.stringify(this.formData);
        //Hides Nav Bar
        let nav = document.getElementById('status-buttons');
        nav.setAttribute('style', 'display: none');

        let randomNumber = Math.ceil(Math.random() * 10);
        this.submitted = true;
        let mockData;
        
        //randomNumber < 5 ? this.submitFail = true : this.submitSuccess = true;
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json; charset=utf-8');

        const options = {
            headers: headers
        }

        this.http.post(this.postUrl, jsonFormData).subscribe(
            (data: any) => {
                console.log(data);
                //Read Correlation ID here
                //this.correlationId = Object's Correlation ID
            },
            (error: any )=> {
                console.log(error);
                console.error(`Error: ${error.status} ${error.statusText}`)
                this.submitSuccess = false;
                this.submitFail = true;
            }
        )

        //Fire this after correlation id is retrieved from http.post
        const checkStatus = setInterval(() => {
            console.log("Set interval fired");

            //Send get request with correlation id retrieved from http.post
            this.http.get(this.getUrl + this.correlationId).subscribe(
                res => {
                    //randomNumber < 5 ? this.submitFail = true : this.submitSuccess = true;
                    console.log(res);
                    mockData = res;
                    console.log(mockData.PercentageComplete);
                    console.log(mockData.RedirectionUrl.length);
                    this.percentComplete = mockData.PercentageComplete;
                    //this.correlationId = mockData.CorrelationId;
                    //this.redirectionUrl = mockData.RedirectionUrl;
                    console.log(this.redirectionUrl);

                    console.log('Sucess function triggered');
                    if (this.percentComplete == 100 || this.redirectionUrl != undefined) {
                        this.submitSuccess = true;
                        //Clears Interval
                        clearInterval(checkStatus);
                        console.log("Interval should be cleared");
                    }
                },
                error => {
                    console.error(`Error: ${error.status} ${error.statusText}`);
                    this.submitSuccess = false;
                    this.submitFail = true;
                    clearInterval(checkStatus);
                },
                () => {
                    // 'onCompleted' callback.
                    // No errors, route to new page here
                }
            )
        }, 2500)
    }
}
