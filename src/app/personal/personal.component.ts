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
import { ForbiddenValidatorDirective } from '../shared/custom-validations.directive';

import { NgbTypeahead, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];



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
    apiRoot: string = "http://www.pingyo.com/find/locales/zipcode/";

    constructor(
        private router: Router,
        private formDataService: FormDataService, 
        private http:HttpClient, 
        public formData: FormData, 
        private config: NgbTooltipConfig
        ) {
        config.placement = 'right';
        config.triggers = 'hover';
    }

    getZipInformation() {
        let url = `${this.apiRoot}`;
        let element: HTMLElement = document.getElementById('user-zipcode');
        let zipcodeElement: HTMLInputElement = element as HTMLInputElement;
        url = url + zipcodeElement.value;

        if (zipcodeElement.value.length == 5 && Number(zipcodeElement.value)) {
            this.http.get(url).subscribe(
                res => {
                    console.log(this.personal);
                    this.personal.homePhone = "(" + res[0].AreaCode + ") ";
                    this.personal.workPhone = "(" + res[0].AreaCode + ") ";
                    this.personal.mobilePhone = "(" + res[0].AreaCode + ") ";
                    this.personal.city = res[0].City;
                    this.personal.state = res[0].StateAbbreviation;
                    this.personal.issuingState = res[0].StateAbbreviation;

                    this.formDataService.setUserLocation(this.personal);

                    this.formData.typeAheadState = [];
                    this.formData.typeAheadCity = [];
                    this.formData.typeAheadState.push(res[0].StateAbbreviation);
                    this.formData.typeAheadCity.push(res[0].City);
                    console.log(res);
                },
                msg => {
                    console.error(`Error: ${msg.status} ${msg.statusText}`)
                }
            );
        }
        console.log(this.formData);
    }

    checkMatchingPhoneNumbers () {
        let elementMobile: HTMLElement = document.getElementById('mobilePhone');
        let mobileValue: HTMLInputElement = elementMobile as HTMLInputElement;

        let elementWork: HTMLElement = document.getElementById('workPhone');
        let workValue: HTMLInputElement = elementWork as HTMLInputElement;

        let phoneMessageElement: HTMLElement = document.getElementById('phoneMessage');
        let phoneMessage: HTMLInputElement = phoneMessageElement as HTMLInputElement


        if (mobileValue.value == workValue.value) {
            phoneMessageElement.innerHTML = '<div>NOTE: Your work and home or cell numbers match, many lenders will treat you as self - employed and many will decline to consider your application due to lack of detailed information.This decreases your chance for acceptance. We encourage you to provide a real work number which is separate from your mobile to gain the highest possible chance for acceptance</div>'
        }
        else {phoneMessageElement.innerHTML = ''}
    }

    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
        console.log('Personal feature loaded!');
        console.log(this.personal);
    }

    smoothScroll () {
        let element: HTMLElement = document.getElementById('personal-info');
        (element).scrollIntoView({
            behavior: 'smooth'
        });
    }


    //Typeahead for States
    model: any;

    formatter = (result: string) => result.toUpperCase();

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

    //End Typeahead for States

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setPersonal(this.personal);
        return true;
    }

    goToNext(form: any) {
        window.scrollTo(0, 0);
        if (this.save(form)) {
            // Navigate to the income page
            this.router.navigate(['/income']);
        }
    }
}

