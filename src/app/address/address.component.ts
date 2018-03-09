import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Address } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { Http, Response, RequestOptions, Headers, HttpModule, RequestMethod } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';


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
    apiRoot: string = "http://pingtree-geo.cloudapp.net:8090/GeoService/find/locales/areacode/843";
    constructor(private router: Router, private formDataService: FormDataService, private http:HttpClient) {
    }

    ngOnInit() {
        this.address = this.formDataService.getAddress();
        console.log('Address feature loaded!');
    }

    //Get request for zip code field
    doGETWithHeaders() {
        console.log("GET WITH HEADERS");
        // let headers2 = new Headers();
        // headers2.append('Authorization', 'Bearer 7da1c7d1-9b30-4977-976b-bda40435f75d');

        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer 7da1c7d1-9b30-4977-976b-bda40435f75d'
            
            });
        console.log({headers: headers});
        // let opts = new RequestOptions();
        // opts.headers = headers2;
        // opts.method = RequestMethod.Get;
        //console.log(opts);
        let url = `${this.apiRoot}`;
        this.http.get(url, {headers: headers}).subscribe(
            res => console.log(res),
            msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
        );
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