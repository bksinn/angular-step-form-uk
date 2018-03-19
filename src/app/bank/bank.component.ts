import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Bank } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { FormData } from '../data/formData.model';


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
    bankNameArray: Array<any> = []
    bankNameArrayFiltered: Array<any> = []
    bankRoutingNumbers: Array<any> = []
    apiRootBank: string = "http://www.pingyo.com/find/bank/names/";
    apiFindBankData: string = "http://www.pingyo.com/find/banks/name/";
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    constructor(private router: Router, private formDataService: FormDataService, private http: HttpClient, public formData: FormData) {
    }

    ngOnInit() {
        this.bank = this.formDataService.getBank();
        console.log('Bank feature loaded!');
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
                },
                msg => {
                    console.error(`Error: ${msg.status} ${msg.statusText}`)
                }
            );
        }
    }

    getBankRoutingInformation () {
        let element: HTMLElement = document.getElementById('user-bank');
        let elementRouting: HTMLElement = document.getElementById('routing-div');
        let bankElement: HTMLInputElement = element as HTMLInputElement;
        let routingElement: HTMLInputElement = elementRouting as HTMLInputElement;
        let routingNumber = this.bank.routingNumber;
        //elementRouting.removeAttribute('validateABA')
        console.log(elementRouting);

        //CHECKBOX My bank is located in the same State as me
        //function onclick located on the checkbox
        //if (checkbox is clicked) {do promise} 
        //else{
        //      show elementRouting, clear value, add validateABA if not there 
        //}
        let promise = new Promise((resolve, reject) => {
            this.http.get(`${this.apiFindBankData}` + bankElement.value)
                .toPromise()
                .then(
                    res => { // Success
                        this.bankNameArray = [];
                        this.bankNameArray.push(res);
                        this.bankNameArrayFiltered = [];

                        //Matches bank names to user's city/state
                        for (var i = 0; i < this.bankNameArray.length; i++) {
                            this.bankNameArrayFiltered = []; //Clears array
                            this.bankNameArray[i].filter((element) => {
                                
                                if (element.City.includes(this.formData.typeAheadCity[0] && element.StateAbbreviation.includes(this.formData.typeAheadState[0]))) {
                                    console.log(element);
                                    this.bankNameArrayFiltered.push(element);
                                }
                                else if (element.StateAbbreviation.includes(this.formData.typeAheadState[0])) {                                
                                    this.bankNameArrayFiltered.push(element);
                                }
                            })
                        }
                        //End matches bank names to user's city/state

                        this.bankRoutingNumbers = [];
                        this.bank.routingNumber = '';
                        this.formDataService.clearRoutingNumber(this.bank);

                        //Prefills routing number if only one exists for user's city and/or state
                        if (this.bankNameArrayFiltered.length) {
                            //elementRouting.setAttribute('style', 'display: none;');
                            this.bankRoutingNumbers = []; //Clears array

                            this.bankRoutingNumbers.push(this.bankNameArrayFiltered[0].RoutingNumber + " " + this.bankNameArrayFiltered[0].City + " " + 'Branch');
                            this.bank.routingNumber = this.bankRoutingNumbers[0].slice(0,9);
                    
                            //Check if routing number is unique                        
                            this.bankNameArrayFiltered.forEach((element) => {
                                if (this.bank.routingNumber != element.RoutingNumber) {
                                    elementRouting.removeAttribute('style');
                                    this.bankRoutingNumbers.push(element.RoutingNumber + " " + element.City + " " + 'Branch');
                                }
                                this.formDataService.setRoutingNumber(this.bank);
                                elementRouting.removeAttribute('style');
                            })
                            //End routing number check
                        }
                        else {
                            elementRouting.removeAttribute('style');
                        }
                        console.log(this.bankNameArray);
                        console.log(this.bankNameArrayFiltered);
                        resolve();
                    },
                    msg => {
                        this.bank.routingNumber = '';
                        this.formDataService.clearRoutingNumber(this.bank);
                        elementRouting.removeAttribute('style');
                        console.error(`Error: ${msg.status} ${msg.statusText}`)
                    },
                );
        });
    }

    //Typeahead for Bank Names
    formatter = (result: string) => result;

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? [] : this.bankArray[0]);


    //End Typeahead for Bank names

    //Typeahead for Routing number
    formatter2 = (result: string) => result;

    search2 = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? [] : this.bankRoutingNumbers);


    //End Typeahead for Routing Number

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