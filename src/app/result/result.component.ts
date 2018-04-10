import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../data/formData.model';
import { FormData } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';

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
    errorList;
    countDown;
    count = 10;
    testUrl: string = 'https://jsonplaceholder.typicode.com/posts';
    postUrl: string = 'https://leads.pingyo.com/application/submit';
    status;
    getUrl: string = 'https://leads.pingyo.com/application/status/';
    correlationId;
    redirectionUrl;
    noLenderMatch: boolean = false;
    percentComplete = 0;
    countDown2;
    count2 = 5;
    ipAddress;
    clientUserAgent = navigator.userAgent;
    
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
                    window.location.href = this.redirectionUrl;
                }
                return --this.count2;
            })
        );
    }

    ngOnInit() {
        this.result = this.formDataService.getResult();
        this.formData = this.formDataService.getFormData();
        this.isFormValid = this.formDataService.isFormValid();

        //Retrieve user's IP address => Limited to 150 requests per day
        this.http.get('https://api.ipify.org/?format=json').subscribe(
            (res: any) => {
                this.ipAddress = res.ip;
            }
        )
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
        this.noLenderMatch = false;
        this.count = 10;
        this.count2 = 5;
        this.percentComplete = 0;
        this.errorList = null;

        //Replaces Nav Bar
        document.getElementById('status-buttons').removeAttribute('style');
    }

    submit(form: any) {
        window.scrollTo(0, 0);
        if (this.save(form)) {
            // Navigate to the result page
            //this.router.navigate(['/personal']);
        }
        else {
            console.log("FORM INCOMPLETE");
        }
    }

    processFormData () {
        let applicationData = {
            "Campaign": 'Test',
            "AffiliateId": "usa_test",
            "SubAffiliate": null,
            "Timeout": 120,
            "TestOnly": true,
            "Application": {
                "Title": 1,
                "FirstName": this.formData.firstName,
                "LastName": this.formData.lastName,
                "DateOfBirth": this.formData.DateofBirth,
                "Email": this.formData.email,
                "HomePhoneNumber": this.formData.homePhone.length == 10 ? Number(this.formData.homePhone.replace(/\D/g, '')) : Number(this.formData.mobilePhone.replace(/\D/g, '')),
                "MobilePhoneNumber": Number(this.formData.mobilePhone.replace(/\D/g, '')),
                "WorkPhoneNumber": Number(this.formData.workPhone.replace(/\D/g, '')),
                "DriversLicenseNumber": this.formData.driversLicense,
                "DriversLicenseState": this.formData.issuingState,
                "EmployerName": this.formData.employerName,
                "JobTitle": this.formData.jobTitle,
                "EmploymentStarted": this.formData.employmentStarted,
                "IncomeSource": Number(this.formData.incomeSource),
                "PayFrequency": Number(this.formData.payFrequency),
                "PayAmount": Number(this.formData.netAmount),
                "IncomePaymentType": this.formData.paymentType,
                "NextPayDate": this.formData.nextPayDate,
                "FollowingPayDate": this.formData.followingPayDate,
                "LoanAmount": Number(this.formData.loanAmount),
                "Term": Number(this.formData.termPeriod),
                "MilitaryService": Number(this.formData.militaryService),
                "NationalIdentityNumber": this.formData.nationalIdentityNumber.replace(/\D/g, ''),
                "NationalIdentityNumberType": this.formData.nationalIdentityNumberType,
                "ConsentToCreditSearch": this.formData.consentToCreditSearch,
                "ResidentialStatus": Number(this.formData.residentialStatus),
                "HouseNumber": this.formData.street,
                "HouseName": this.formData.street,
                "AddressStreet1": this.formData.street,
                "AddressCity": this.formData.city,
                "AddressCountryCode": "US",
                "AddressCounty": this.formData.county,
                "AddressState": this.formData.state,
                "AddressMoveIn": this.formData.addressMoveIn,
                "AddressPostcode": this.formData.zip,
                "BankName": this.formData.bankName,
                "BankAccountNumber": Number(this.formData.accountNumber),
                "BankCardType": this.formData.bankCardType,
                "BankRoutingNumber": this.formData.routingNumber,
                "MinimumCommissionAmount": 0,
                "MaximumCommissionAmount": 0,
                "ApplicationExtensions": null,
                "LoanAmountCurrencyCode": null,
                "PayAmountCurrencyCode": null
            },
            "SourceDetails": {
                "Address": this.ipAddress,
                "ClientUserAgent": this.clientUserAgent,
                "CreationUrl": "www.my-loans.co.uk",
                "LanguageCodes": ["en-US"],
                "ReferringUrl": "www.my-loans.co.uk"
            }
        }

        return JSON.stringify(applicationData);
    }

    processForm () {
        //Status message on progress page
        this.status = this.status ? this.status : "Searching";
        const applicationData = this.processFormData();
        //Hides Nav Bar
        let nav = document.getElementById('status-buttons');
        nav.setAttribute('style', 'display: none');

        let randomNumber = Math.ceil(Math.random() * 10);
        this.submitted = true;
        let responseData;
        
        //randomNumber < 5 ? this.submitFail = true : this.submitSuccess = true;
        let headers = new HttpHeaders().append('Content-Type', 'application/json');

        const options = {
            headers: headers
        }

        this.http.post(this.postUrl, applicationData, options).subscribe(
            (res: any) => {
                console.log(res);
                console.log(res.CorrelationId);
                this.correlationId = res.CorrelationId;
            },
            (error: any) => {
                console.log(error);
                console.error(`Error: ${error.status} ${error.statusText}`)

                this.errorList = error.error.Errors;
                console.log(this.errorList);
                this.correlationId = `${error.CorrelationId}`;
                this.submitSuccess = false;
                this.submitFail = true;
            }
        )

        //Fire this after correlation id is retrieved from http.post
        const checkStatus = setInterval(() => {
            console.log("url: " + this.getUrl + this.correlationId);
            //Send get request with correlation id retrieved from http.post
            this.http.get(this.getUrl + this.correlationId).subscribe(
                res => {
                    //randomNumber < 5 ? this.submitFail = true : this.submitSuccess = true;
                    console.log(res);
                    responseData = res;
                    console.log(responseData.PercentageComplete);
                    console.log(responseData.RedirectionUrl);
                    this.status = responseData.Status
                    this.percentComplete = responseData.PercentageComplete;
                    this.redirectionUrl = responseData.RedirectionUrl;
                    console.log(this.redirectionUrl);

                    if (this.percentComplete == 100 && !this.redirectionUrl) {
                        this.noLenderMatch = true;
                        clearInterval(checkStatus);
                        this.status = null;
                    }
                    else if (this.percentComplete == 100 || this.redirectionUrl != null) {
                        this.submitSuccess = true;
                        //Clears Interval
                        clearInterval(checkStatus);
                        this.status = null;
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