import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { FormData } from '../data/formData.model';
import { HttpClient } from '@angular/common/http';

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
    apiRootBank: string = "https://www.pingyo.com/find/bank/names/CitiC";
    apiRootValidate: string = "https://www.pingyo.com/validate/locales/areacode/";
    apiRoot: string = "https://www.pingyo.com/find/locales/zipcode/";
    apiValidateZip: string = "https://www.pingyo.com/validate/locales/zipcode/";
    cityArr: Array<any> = []

    constructor(private router: Router, private formDataService: FormDataService, private http:HttpClient, public formData: FormData) {
    }

    ngOnInit() {
        this.address = this.formDataService.getAddress();
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
                    this.address.county = res[0].County;

                    this.formDataService.setCity(this.address);
                    this.formDataService.setState(this.address);
                    this.formDataService.setCounty(this.address);

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