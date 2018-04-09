import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';

// import {
//     trigger,
//     state,
//     style,
//     animate,
//     transition
// } from '@angular/animations';
import { Income } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'mt-wizard-income',
    templateUrl: './income.component.html',
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

export class IncomeComponent implements OnInit {
    title = 'Please provide information about your income';
    income: Income;
    form: any;

    constructor(private router: Router, private formDataService: FormDataService, private config: NgbTooltipConfig) {
        config.placement = 'right';
        config.triggers = 'hover';
    }

    forceNumeric ($event) {
        $event.target.value = $event.target.value.replace(/[^0-9\.]+/g, '');
    }

    ngOnInit() {
        this.income = this.formDataService.getIncome();
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setIncome(this.income);
        return true;
    }

    goToPrevious(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the personal page
            this.router.navigate(['/personal']);
        }
    }

    goToNext(form: any) {
        // Scrolls to top of the page
        window.scrollTo(0, 0);

        if (this.save(form)) {
            // Navigate to the address page
            this.router.navigate(['/address']);
        }
    }
}

