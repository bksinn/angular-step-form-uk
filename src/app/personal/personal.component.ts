import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { 
//     trigger,
//     state,
//     style,
//     animate,
//     transition
// } from '@angular/animations';
import { Personal } from '../data/formData.model';
import { FormData } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { PingYoService } from '../shared/pingyo.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'mt-wizard-personal',
    templateUrl: './personal.component.html',
    // animations: [
    //     trigger('flyInOut', [
    //         state('in', style({ transform: 'translateX(0)' })),
    //         transition('void => *', [
    //             style({ transform: 'translateX(-100%)' }),
    //             animate(100)
    //         ]),
    //         transition('* => void', [
    //             animate(100, style({ transform: 'translateX(100%)' }))
    //         ])
    //     ])
    // ]
})

export class PersonalComponent implements OnInit {
    title1 = "Tell us how much you'd like to borrow";
    title2 = 'Please tell us your name';
    title3 = "Please fill in your personal details";
    personal: Personal;
    form: any;
    apiRoot: string = "https://www.pingyo.com/find/locales/zipcode/";
    response: Array<any> = [];
    areaCode: string = '';

    constructor(
        private router: Router,
        private formDataService: FormDataService,
        private http: HttpClient,
        public formData: FormData,
        private pingYoService: PingYoService,
        private config: NgbTooltipConfig
    ) {
        config.placement = 'right';
        config.triggers = 'hover';
    }

    scrollToPersonalInfo($event) {
        if ($event.target.value.length > 9) {
            document.querySelector('#personal-info').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    getZipInformation() {
        let url = `${this.apiRoot}`;
        let element: HTMLElement = document.getElementById('user-zipcode');
        let zipcodeElement: HTMLInputElement = element as HTMLInputElement;
        url = url + zipcodeElement.value;
        if (zipcodeElement.value.length == 5 && Number(zipcodeElement.value)) {
            this.http.get(url).subscribe(
                res => {
                    document.querySelector('#title-2').scrollIntoView({
                        behavior: 'smooth'
                    });

                    //Check to see if all area codes match, then auto fill ==> else, don't auto fill
                    this.response = [];
                    this.response.push(res);
                    this.areaCode = res[0].AreaCode;

                    this.response[0].forEach((obj) => {
                        if (this.areaCode == obj.AreaCode) {
                            this.personal.homePhone = "(" + this.areaCode + ") ";
                            this.personal.workPhone = "(" + this.areaCode + ") ";
                            this.personal.mobilePhone = "(" + this.areaCode + ") ";
                        }
                        else {
                            this.personal.homePhone = ""
                            this.personal.workPhone = ""
                            this.personal.mobilePhone = ""
                        }
                    })
                    //End Check to see if all area codes match

                    this.personal.city = res[0].City;
                    this.personal.state = res[0].StateAbbreviation;
                    this.personal.county = res[0].County;
                    this.personal.issuingState = res[0].StateAbbreviation;

                    this.formDataService.setUserLocation(this.personal);

                    this.formData.typeAheadState = [];
                    this.formData.typeAheadCity = [];
                    this.formData.typeAheadState.push(res[0].StateAbbreviation);
                    this.formData.typeAheadCity.push(res[0].City);
                },
                msg => {
                    console.error(`Error: ${msg.status} ${msg.statusText}`)
                }
            );
        }
    }

    forceNumeric($event) {
        $event.target.value = $event.target.value.replace(/[^0-9\.]+/g, '');
    }

    addGmail() {
        let emailElement: HTMLElement = document.getElementById('email');
        let emailInput: HTMLInputElement = emailElement as HTMLInputElement;

        let emailDomain = emailInput.value.indexOf('@');
        if (emailDomain !== -1) {
            emailInput.value = emailInput.value.slice(0, emailDomain);
        }

        emailInput.value += "@gmail.com"
        this.personal.email = emailInput.value;
    }

    addYahoo() {
        let emailElement: HTMLElement = document.getElementById('email');
        let emailInput: HTMLInputElement = emailElement as HTMLInputElement;

        let emailDomain = emailInput.value.indexOf('@');
        if (emailDomain !== -1) {
            emailInput.value = emailInput.value.slice(0, emailDomain);
        }

        emailInput.value += "@yahoo.com"
        this.personal.email = emailInput.value;
    }

    addHotmail() {
        let emailElement: HTMLElement = document.getElementById('email');
        let emailInput: HTMLInputElement = emailElement as HTMLInputElement;

        let emailDomain = emailInput.value.indexOf('@');
        if (emailDomain !== -1) {
            emailInput.value = emailInput.value.slice(0, emailDomain);
        }

        emailInput.value += "@hotmail.com"
        this.personal.email = emailInput.value;
    }

    addAol() {
        let emailElement: HTMLElement = document.getElementById('email');
        let emailInput: HTMLInputElement = emailElement as HTMLInputElement;

        let emailDomain = emailInput.value.indexOf('@');
        if (emailDomain !== -1) {
            emailInput.value = emailInput.value.slice(0, emailDomain);
        }

        emailInput.value += "@aol.com"
        this.personal.email = emailInput.value;
    }

    ngOnInit() {
        console.log(this.pingYoService.getUrlVars().la);

        this.personal = this.formDataService.getPersonal();
        let loanAmountFromUrl = Number(this.pingYoService.getUrlVars().la);
        let termFromUrl = Number(this.pingYoService.getUrlVars().term);
        let firstNameFromUrl = this.pingYoService.getUrlVars().fn ? this.pingYoService.getUrlVars().fn : '';
        let lastNameFromUrl = this.pingYoService.getUrlVars().ln ? this.pingYoService.getUrlVars().ln : '';
        let emailFromUrl = this.pingYoService.getUrlVars().em ? this.pingYoService.getUrlVars().em : '';

        if (loanAmountFromUrl % 50 == 0 && loanAmountFromUrl >= 250) {
            this.personal.loanAmount = String(loanAmountFromUrl);
        }
        if (termFromUrl % 1 == 0 && termFromUrl >= 3 && termFromUrl < 18) {
            this.personal.termPeriod = String(termFromUrl);
        }
        else if (termFromUrl % 1 == 0 && termFromUrl > 18) {
            this.personal.termPeriod = '18';
        }

        this.personal.firstName = firstNameFromUrl;
        this.personal.lastName = lastNameFromUrl;
        this.personal.email = emailFromUrl;
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setPersonal(this.personal);
        return true;
    }

    goToNext(form: any) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

        if (this.save(form)) {
            // Navigate to the income page
            document.getElementById('one').classList.add('completed-tabs')

            this.formDataService.updatePercentFormData();
            this.router.navigate(['/income']);
        }
    }
}

