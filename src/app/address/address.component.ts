import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { FormData } from '../data/formData.model';
import { HttpClient } from '@angular/common/http';
//Ng-Bootstrap
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
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

// import {
//     trigger,
//     state,
//     style,
//     animate,
//     transition
// } from '@angular/animations';

@Component({
    selector: 'mt-wizard-address', 
    templateUrl: './address.component.html',
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

export class AddressComponent implements OnInit {
    title1 = 'Where do you live?';
    title2 = 'How long at this address?';
    address: Address;
    form: any;
    //apiRoot: string = "http://httpbin.org/get";
    apiRootBank: string = "http://www.pingyo.com/find/bank/names/CitiC";
    apiRootValidate: string = "http://www.pingyo.com/validate/locales/areacode/";
    apiRoot: string = "http://www.pingyo.com/find/locales/zipcode/";
    apiValidateZip: string = "http://www.pingyo.com/validate/locales/zipcode/";
    cityArr: Array<any> = []

    constructor(private router: Router, private formDataService: FormDataService, private http:HttpClient, public formData: FormData) {
    }

    ngOnInit() {
        this.address = this.formDataService.getAddress();
        console.log('Address feature loaded!');
        console.log(this.formData);
    }

    //Get request for zip code field
    getZipInformation() {
        let url = `${this.apiRoot}`;
        let element: HTMLElement = document.getElementById('user-zipcode'); 
        let zipcodeElement: HTMLInputElement = element as HTMLInputElement;
        url = url + zipcodeElement.value;

        if (zipcodeElement.value.length == 5 && Number(zipcodeElement.value)) {
            this.http.get(url).subscribe(
                res => {
                    this.address.city = res[0].City;
                    this.address.state = res[0].StateAbbreviation;

                    this.formDataService.setCity(this.address);
                    this.formDataService.setState(this.address);

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

    @ViewChild('instance') instance: NgbTypeahead;
    onFocus = new Subject<string>();
    onClick = new Subject<string>();

    search2 = (text$: Observable<string>) =>
        text$
            .debounceTime(200).distinctUntilChanged()
            .merge(this.onFocus)
            .merge(this.onClick.filter(() => !this.instance.isPopupOpen()))
            .map(term => (term === '' ? this.cityArr : this.cityArr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10));


    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        this.formDataService.setAddress(this.address);
        return true;
    }

    goToPrevious(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the income page
            this.router.navigate(['/income']);
        }
    }

    goToNext(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the bank page
            this.router.navigate(['/bank']);
        }
    }
}