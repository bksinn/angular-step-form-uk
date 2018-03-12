import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Bank } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';

import { HttpClient } from '@angular/common/http';
//Ng-Bootstrap
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

// import {
//     trigger,
//     state,
//     style,
//     animate,
//     transition
// } from '@angular/animations';

const information = ['something'];

@Component({
    selector: 'mt-wizard-bank',
    templateUrl: './bank.component.html',
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

export class BankComponent implements OnInit {
    title = 'Please enter your bank information';
    bank: Bank;
    form: any;
    bankArray: Array<any> = []
    bankResponse: Object
    apiRootBank: string = "http://www.pingyo.com/find/bank/names/";
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    constructor(private router: Router, private formDataService: FormDataService, private http: HttpClient) {
    }

    ngOnInit() {
        this.bank = this.formDataService.getBank();
        console.log('Bank feature loaded!');

        this.http.get('something')
    }

    getBankInformation() {
        let url = `${this.apiRootBank}`;
        let element: HTMLElement = document.getElementById('user-bank');
        let bankElement: HTMLInputElement = element as HTMLInputElement;
        url = url + bankElement.value;
        console.log(bankElement.value);

        if (bankElement.value.length) {
            this.http.get(url).subscribe(
                res => {
                    this.bankArray = [];
                    this.bankArray.push(res);
                    console.log(res)
                    this.bankResponse = res;
                },
                msg => {
                    console.error(`Error: ${msg.status} ${msg.statusText}`)
                }
            );
        }
        console.log(this.bankResponse);
        console.log(this.bankArray);
    }

    //Typeahead for Bank Names
    formatter = (result: string) => result;


    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? [] : this.bankArray[0]);


    //End Typeahead for Bank names

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setBank(this.bank);
        return true;
    }

    goToPrevious(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the personal page
            this.router.navigate(['/address']);
        }
    }

    goToNext(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the address page
            this.router.navigate(['/result']);
        }
    }
}